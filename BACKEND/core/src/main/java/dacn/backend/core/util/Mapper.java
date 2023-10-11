package dacn.backend.core.util;

import dacn.backend.core.dto.UserDto;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.Users;
import org.springframework.stereotype.Component;

@Component
public class Mapper {
    public UserDto userToUserDto(Users user) {
        UserDto dto = new UserDto();

        dto.setId(user.getId());
        dto.setRole(user.getRole());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setUserNumber(user.getUserNumber());
        dto.setFullName(user.getFullName());

        return dto;
    }
}
