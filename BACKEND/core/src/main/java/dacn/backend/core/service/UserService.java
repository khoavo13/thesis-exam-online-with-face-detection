package dacn.backend.core.service;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.dto.AuthRequest;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.dto.UserDto;
import dacn.backend.core.entity.UnusualAction;
import dacn.backend.core.entity.Users;

import java.util.List;

public interface UserService {
    Users createUser(Users user);

    Users getInfoUser(Long userId);

    SubmissionDto getSubmissionByStudentIdAndExamId(Long studentId, Long examId);

    Long validateAuthRequest(AuthRequest request);
    Long getUserIdByUsername(String username);
    UnusualAction insertUnusualAction(UnusualAction unusualAction, Long roomId, Long studentId);
    List<UnusualAction> getAllUnusualActionByStudentId(Long studentId);
}
