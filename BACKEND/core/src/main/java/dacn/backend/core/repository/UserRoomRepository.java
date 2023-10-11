package dacn.backend.core.repository;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.entity.UserRoom;
import dacn.backend.core.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository

public interface UserRoomRepository extends JpaRepository<UserRoom, Long>{
        List<UserRoom> findAllByUserId(Long studentId);
        Optional<UserRoom> findByRoomIdAndUserId(Long roomId,Long studentId);

        @Query("select ur from UserRoom ur where ur.user.id = :id and ur.user.role = :role")
        List<UserRoom> findByIdAndRole(Long id, Role role);

        @Query("select ur.user from UserRoom ur where ur.room.id = :roomId and ur.user.role = 0")
        List<Users> findAllStudentInRoom(Long roomId);
}
