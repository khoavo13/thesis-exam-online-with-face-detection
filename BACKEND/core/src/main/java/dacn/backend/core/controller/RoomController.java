package dacn.backend.core.controller;

import dacn.backend.core.dto.JoinRoomRequest;
import dacn.backend.core.dto.RoomStudentDto;
import dacn.backend.core.dto.UpdateRoom;
import dacn.backend.core.dto.UserDto;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.UserRoom;
import dacn.backend.core.service.RoomService;
import dacn.backend.core.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/rooms")
public class RoomController extends BaseController{
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("")
    ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAll());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyAuthority(#root.this.studentRole, #root.this.adminRole)")
    ResponseEntity<List<RoomStudentDto>> getAllRoomsByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(roomService.getAllByStudent(studentId));
    }

    @GetMapping("/{roomId}/students")
    @PreAuthorize("hasAnyAuthority(#root.this.teacherRole, #root.this.adminRole)")
    ResponseEntity<List<UserDto>> getAllStudentInRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(roomService.getAllStudentInRoom(roomId).stream()
                .map(mapper::userToUserDto).collect(Collectors.toList()));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyAuthority(#root.this.teacherRole, #root.this.adminRole)")
    ResponseEntity<List<Room>> getAllRoomsByTeacherId(@PathVariable Long teacherId) {
        List<Room> rooms = roomService.getAllByTeacher(teacherId);
        rooms.forEach(room -> room.getExam().setQuestions(Collections.emptyList()));
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        Room room = roomService.getById(id);
        room.getExam().setQuestions(Collections.emptyList());
        return ResponseEntity.ok(room);
    }

    @PutMapping("/{id}")

    @PreAuthorize("hasAnyAuthority(#root.this.teacherRole, #root.this.adminRole)")
    ResponseEntity<Room> updateStatusRoomById(@PathVariable Long id,
                                              @RequestBody UpdateRoom room) {
        Room roomDto = roomService.updateStatusRoomById(id, room);
        roomDto.getExam().setQuestions(Collections.emptyList());
        return ResponseEntity.ok(roomDto);
    }

    @PostMapping("/assignment")
    @PreAuthorize("hasAnyAuthority(#root.this.adminRole)")
    ResponseEntity<Room> assignSupervisorForRoom(@RequestParam Long userId, @RequestParam Long roomId) {
        Room room = roomService.assignSupervisorForRoom(userId, roomId);
        room.getExam().setQuestions(Collections.emptyList());
        return ResponseEntity.ok(room);
    }

    @PostMapping("/join/{roomId}")
    @PreAuthorize("hasAnyAuthority(#root.this.adminRole)")
    ResponseEntity<UserRoom> joinRoom(@PathVariable Long roomId, @RequestBody JoinRoomRequest request) {
        return ResponseEntity.ok(roomService.joinRoom(roomId, request));
    }
}
