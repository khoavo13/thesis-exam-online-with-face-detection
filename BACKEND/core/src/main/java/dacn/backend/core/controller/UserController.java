package dacn.backend.core.controller;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.dto.ResponseModel;
import dacn.backend.core.common.util.JwtUtil;
import dacn.backend.core.dto.AuthRequest;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.dto.TokenResponse;
import dacn.backend.core.dto.UserDto;
import dacn.backend.core.entity.UnusualAction;
import dacn.backend.core.entity.Users;
import dacn.backend.core.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/users")
public class UserController extends BaseController{
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("")
    ResponseEntity<UserDto> createUser(@RequestBody Users user) {
        return ResponseEntity.ok(mapper.userToUserDto(userService.createUser(user)));
    }

    @GetMapping("/{id}")
    ResponseEntity<UserDto> getInfoUser(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.userToUserDto(userService.getInfoUser(id)));
    }

    @GetMapping("/student/{studentId}/submissions/{examId}")
    ResponseEntity<SubmissionDto> getSubmissionByExamId(@PathVariable Long studentId, @PathVariable Long examId) {
        return ResponseEntity.ok(userService.getSubmissionByStudentIdAndExamId(studentId,examId));
    }

    @PostMapping("/auth/login")
    ResponseEntity<ResponseModel> login(@RequestBody AuthRequest request) {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword())
            );
            String accessToken = jwtUtil.generateAccessToken(authentication);
            return ResponseEntity.ok().body(new ResponseModel(new TokenResponse(accessToken,
                    userService.getUserIdByUsername(request.getUsername()),
                    authentication.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority).collect(Collectors.toList())),
                    HttpStatus.OK
                    ));
    }

    @PostMapping("/unusual-action")
    ResponseEntity<UnusualAction> insertUnusualAction(@RequestBody UnusualAction unusualAction,
                                                      @RequestParam Long roomId, @RequestParam Long studentId) {
        return ResponseEntity.ok().body(userService.insertUnusualAction(unusualAction, roomId, studentId));
    }

    @PostMapping("/unusual-actions/{studentId}")
    ResponseEntity<List<UnusualAction>> getAllUnusualActionByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok().body(userService.getAllUnusualActionByStudentId(studentId));
    }

    @GetMapping ("/auth/{userId}/refresh-token")
    ResponseEntity<ResponseModel> refreshToken(HttpServletRequest request, @PathVariable Long userId) {
            String authHeader = request.getHeader("Authorization");
            String accessToken = authHeader.replace("Bearer ","");

            return ResponseEntity.ok().body(new ResponseModel(jwtUtil.generateRefreshToken(accessToken, userId) ,
                    HttpStatus.OK
            ));
    }
}
