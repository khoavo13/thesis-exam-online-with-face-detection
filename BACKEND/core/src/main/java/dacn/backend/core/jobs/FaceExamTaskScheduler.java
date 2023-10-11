package dacn.backend.core.jobs;

import dacn.backend.core.common.enums.RoomStatus;
import dacn.backend.core.jobs.task.UpdateRoomStatusTask;
import dacn.backend.core.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.time.ZoneId;

@Component
public class FaceExamTaskScheduler {
    @Autowired
    @Qualifier("taskScheduler")
    private TaskScheduler taskScheduler;
    @Autowired
    private RoomService roomService;


    @PostConstruct
    void run() {
        roomService.getAll().forEach(room -> {
            taskScheduler.schedule(new UpdateRoomStatusTask(roomService, room.getId(), RoomStatus.OPEN),
                    Date.from(room.getExam().getStartDate().minusMinutes(15).atZone(ZoneId.systemDefault()).toInstant()));
            taskScheduler.schedule(new UpdateRoomStatusTask(roomService, room.getId(), RoomStatus.CLOSED),
                    Date.from(room.getExam().getEndDate().plusMinutes(5).atZone(ZoneId.systemDefault()).toInstant()));
        });
    }
}
