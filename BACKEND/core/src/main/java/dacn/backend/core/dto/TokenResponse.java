package dacn.backend.core.dto;

import dacn.backend.core.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {
    private String token;
    private Long userId;
    private List<String> role;
}
