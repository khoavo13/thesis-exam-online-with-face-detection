package dacn.backend.core.dto;

import dacn.backend.core.common.enums.RoomStatus;
import dacn.backend.core.entity.Exam;
import dacn.backend.core.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomStudentDto {
    private Long id;
    private RoomStatus status;
    private Long capacity;
    private String groupName;
    private boolean allowAccess = true;
    private Exam exam;

}
