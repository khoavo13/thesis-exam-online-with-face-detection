package dacn.backend.core.dto;

import dacn.backend.core.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String userNumber;
    private String username;
    private String email;
    private String fullName;
    private Role role;

}
