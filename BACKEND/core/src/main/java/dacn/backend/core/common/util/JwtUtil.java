package dacn.backend.core.common.util;

import dacn.backend.core.dto.TokenResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    private static final long ACCESS_TOKEN_EXPIRE_DURATION =  24 * 60 * 60 * 1000;
    private static final long REFRESH_TOKEN_EXPIRE_DURATION = 24 * 60 * 60 * 1000;
    private final UserDetailsService userDetailsService;
    @Value("${app.jwt.secret}")
    private String jwtSecret ;

    public JwtUtil(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    public String generateToken(Authentication authentication, Long expireDuration) {
        return Jwts.builder()
                .setSubject(authentication.getName())
                .setIssuedAt(new Date())
                .setIssuer("TienMinh")
                .setExpiration(new Date(System.currentTimeMillis() + expireDuration))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .compact();
    }

    public Authentication getAuthenticationFromToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims payload = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        String username = payload.getSubject();
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );
    }

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, ACCESS_TOKEN_EXPIRE_DURATION);
    }

    public TokenResponse generateRefreshToken(String token, Long userId) {
        Authentication authentication = getAuthenticationFromToken(token);

        return new TokenResponse(generateToken(authentication, REFRESH_TOKEN_EXPIRE_DURATION), userId,
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
    }
}
