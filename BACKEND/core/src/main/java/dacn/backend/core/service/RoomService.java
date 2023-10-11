package dacn.backend.core.service;

import dacn.backend.core.dto.JoinRoomRequest;
import dacn.backend.core.dto.RoomStudentDto;
import dacn.backend.core.dto.UpdateRoom;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.UserRoom;
import dacn.backend.core.entity.Users;

import java.util.List;

public interface RoomService {
    List<Room> getAll();
    List<RoomStudentDto> getAllByStudent(Long studentId);
    List<Room> getAllByTeacher(Long teacherId);
    Room getById(Long id);
    Room createRoom(Room room);
    Room updateStatusRoomById(Long id, UpdateRoom room);
    Room assignSupervisorForRoom(Long userId, Long roomId);
    UserRoom joinRoom(Long roomId, JoinRoomRequest userJoined);
    List<Users> getAllStudentInRoom(Long roomId);
}
