package dacn.backend.core.service.impl;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.dto.AuthRequest;
import dacn.backend.core.dto.SubmissionDto;
import dacn.backend.core.entity.Room;
import dacn.backend.core.entity.Submission;
import dacn.backend.core.entity.UnusualAction;
import dacn.backend.core.entity.UserRoom;
import dacn.backend.core.entity.Users;
import dacn.backend.core.repository.RoomRepository;
import dacn.backend.core.repository.SubmissionRepository;
import dacn.backend.core.repository.UnusualActionRepository;
import dacn.backend.core.repository.UserRoomRepository;
import dacn.backend.core.repository.UsersRepository;
import dacn.backend.core.service.UserService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {
    private final UsersRepository usersRepository;
    private final SubmissionRepository submissionRepository;
    private final RoomRepository roomRepository;
    private final UnusualActionRepository unusualActionRepository;
    private final UserRoomRepository userRoomRepository;

    public UserServiceImpl(UsersRepository usersRepository, SubmissionRepository submissionRepository, RoomRepository roomRepository, UnusualActionRepository unusualActionRepository,
                           UserRoomRepository userRoomRepository) {
        this.usersRepository = usersRepository;
        this.submissionRepository = submissionRepository;
        this.roomRepository = roomRepository;
        this.unusualActionRepository = unusualActionRepository;
        this.userRoomRepository = userRoomRepository;
    }

    @Override
    public Users createUser(Users user) {
        user.setCreatedDate(LocalDateTime.now());
        user.setUpdatedDate(LocalDateTime.now());
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        return usersRepository.save(user);
    }

    @Override
    public Users getInfoUser(Long userId) {
        return usersRepository.findById(userId).orElseThrow(() ->
                new EntityNotFoundException("Not found user with id: " + userId));
    }

    @Override
    public SubmissionDto getSubmissionByStudentIdAndExamId(Long studentId, Long examId){
        Submission submission = submissionRepository.findByStudentIdAndExamId(studentId, examId);

        return new SubmissionDto(submission.getStudent().getId(),submission.getAnswers());
    }

    @Override
    public Long validateAuthRequest(AuthRequest request) {
        String password = new BCryptPasswordEncoder().encode(request.getPassword());
        Users user = usersRepository.findByUsernameAndPassword(request.getUsername(),password)
                .orElseThrow(() ->
                new UsernameNotFoundException("login info incorrect " ));

        return user.getId();
    }

    @Override
    public Long getUserIdByUsername(String username) {
        Users user = usersRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Not found User who has username is " + username));

        return user.getId();
    }

    @Override
    public UnusualAction insertUnusualAction(UnusualAction unusualAction, Long roomId, Long studentId) {
        UserRoom userRoom = userRoomRepository.findByRoomIdAndUserId(roomId, roomId)
                .orElseThrow(() ->
                        new EntityNotFoundException("Not found user_room that has room id is " + roomId));

        userRoom.getUnusualActions().add(unusualAction);
        userRoomRepository.save(userRoom);

        unusualActionRepository.save(unusualAction);

        return unusualAction;

    }

    @Override
    public List<UnusualAction> getAllUnusualActionByStudentId(Long studentId) {
        return Collections.emptyList();
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = usersRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("Not found User who has username is " + username));


        return org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority(user.getRole().name()))
                .build();
    }
}
