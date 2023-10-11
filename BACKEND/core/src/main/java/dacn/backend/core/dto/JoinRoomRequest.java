package dacn.backend.core.dto;

import lombok.Data;

@Data
public class JoinRoomRequest {
    private Long userId;
    private String socketId;
}
