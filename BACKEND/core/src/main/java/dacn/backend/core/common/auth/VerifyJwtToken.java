package dacn.backend.core.common.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import dacn.backend.core.common.util.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class VerifyJwtToken extends OncePerRequestFilter {
    private final JwtUtil jwtUtil ;


    public VerifyJwtToken(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (List.of("/api/users/auth/login", "/ws/info").contains(request.getServletPath())) {
            filterChain.doFilter(request,response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            new ObjectMapper().writeValue(response.getOutputStream(), "Authorization header invalid");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            filterChain.doFilter(request,response);
            return;
        }
        String token = authHeader.replace("Bearer ","");
        try {
            SecurityContextHolder.getContext().setAuthentication(jwtUtil.getAuthenticationFromToken(token));
        } catch (Exception e) {
            // ExpiredJwtException, UnsupportedJwtException, MalformedJwtException, SignatureException, IllegalArgumentException
            new ObjectMapper().writeValue(response.getOutputStream(), "Token invalid : " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            logger.error(e.getMessage(), e);
        }
        filterChain.doFilter(request,response);

    }
}