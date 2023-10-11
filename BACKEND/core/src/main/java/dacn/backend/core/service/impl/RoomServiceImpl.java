package dacn.backend.core.service.impl;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.dto.JoinRoomRequest;
import dacn.backend.core.dto.RoomStudentDto;
import dacn.backend.core.dto.UpdateRoom;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.UnusualAction;
import dacn.backend.core.entity.UserRoom;
import dacn.backend.core.entity.Users;
import dacn.backend.core.repository.RoomRepository;
import dacn.backend.core.repository.UserRoomRepository;
import dacn.backend.core.repository.UsersRepository;
import dacn.backend.core.service.RoomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {
    private final RoomRepository roomRepository;
    private final UsersRepository userRepository;
    private final UserRoomRepository userRoomRepository;

    public RoomServiceImpl(RoomRepository roomRepository,
                           UsersRepository userRepository,
                           UserRoomRepository userRoomRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.userRoomRepository = userRoomRepository;
    }


    @Override
    public List<Room> getAll() {
        return roomRepository.findAll();
    }

    @Override
    public List<RoomStudentDto> getAllByStudent(Long studentId) {
        return userRoomRepository.findAllByUserId(studentId)
                .stream().map(studentRoom -> {
                    RoomStudentDto dto = new RoomStudentDto();
                    dto.setId(studentRoom.getRoom().getId());
                    dto.setStatus(studentRoom.getRoom().getStatus());
                    dto.setCapacity(studentRoom.getRoom().getCapacity());
                    dto.setGroupName(studentRoom.getRoom().getGroupName());

                    dto.setExam(studentRoom.getRoom().getExam());
                    dto.getExam().setQuestions(null);

//                    for (UnusualAction unusualAction : studentRoom.getUnusualActions()) {
//                        if (unusualAction.getRoom().getId().equals(studentRoom.getRoom().getId())) {
//                            dto.setAllowAccess(false);
//                            break;
//                        }
//                    }

                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<Room> getAllByTeacher(Long teacherId) {
        List<Room> rooms = new ArrayList<>();
        userRoomRepository.findByIdAndRole(teacherId, Role.TEACHER).forEach(userRoom -> {
                    rooms.add(userRoom.getRoom());
                });
        return rooms;
    }

    @Override
    public Room getById(Long id) {
        return roomRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Not found room with id: " + id));
    }

    @Override
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Override
    public Room updateStatusRoomById(Long id, UpdateRoom room) {
        Room entity = roomRepository.findById(id).orElseThrow(() ->
                new EntityNotFoundException("Not found room with id: " + id));
        entity.setStatus(room.getStatus());

        return roomRepository.save(entity);
    }

    @Override
    public Room assignSupervisorForRoom(Long userId, Long roomId) {
        Users user = userRepository.findByIdAndRole(userId, Role.TEACHER).orElseThrow(() ->
                new EntityNotFoundException("Not found user has role teacher with id: " + userId));
        Room room = roomRepository.findById(roomId).orElseThrow(() ->
                new EntityNotFoundException("Not found room with id: " + roomId));

        UserRoom userRoom = new UserRoom();
        userRoom.setRoom(room);
        userRoom.setUser(user);

        return roomRepository.save(room);
    }

    @Override
    public UserRoom joinRoom(Long roomId, JoinRoomRequest userJoined) {
        Users user = userRepository.findByIdAndRole(userJoined.getUserId(), Role.TEACHER).orElseThrow(() ->
                new EntityNotFoundException("Not found user has role teacher with id: " + userJoined.getUserId()));
        Room room = roomRepository.findById(roomId).orElseThrow(() ->
                new EntityNotFoundException("Not found room with id: " + roomId));
        UserRoom entity = new UserRoom();

        entity.setRoom(room);
        entity.setUser(user);
        entity.setSocketId(userJoined.getSocketId());

        return userRoomRepository.save(entity);
    }

    @Override
    public List<Users> getAllStudentInRoom(Long roomId) {
        return userRoomRepository.findAllStudentInRoom(roomId);
    }

}
