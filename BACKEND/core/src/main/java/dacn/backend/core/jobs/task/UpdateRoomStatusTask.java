package dacn.backend.core.jobs.task;

import dacn.backend.core.common.enums.RoomStatus;
import dacn.backend.core.dto.UpdateRoom;
import dacn.backend.core.service.RoomService;

public class UpdateRoomStatusTask implements Runnable{
    private final RoomService roomService;
    private final Long roomId;
    private final RoomStatus roomStatus;

    public UpdateRoomStatusTask(RoomService roomService, Long roomId, RoomStatus roomStatus) {
        this.roomService = roomService;
        this.roomId = roomId;
        this.roomStatus = roomStatus;
    }

    @Override
    public void run() {
        UpdateRoom newRoom = new UpdateRoom();
        newRoom.setStatus(roomStatus);
        roomService.updateStatusRoomById(roomId, newRoom);
    }
}
