package dacn.backend.core.dto;

import dacn.backend.core.common.enums.RoomStatus;
import lombok.Data;

@Data
public class UpdateRoom {
    private RoomStatus status;
}
