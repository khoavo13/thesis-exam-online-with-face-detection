import http from "http";
import socketIO from "socket.io";
import schedule from "node-schedule";
import * as service from "./service";
import { UnusualAction, UserAndRoom } from "./model";

export class SocketServer {
  private server: http.Server;
  private port: number;

  private io: socketIO.Server;
  constructor(port: number) {
    this.port = port;

    this.server = new http.Server();
    this.io = new socketIO.Server(this.server, {
      cors: {
        origin: '*',
      }
    });

    this.io.on("connection", (socket: socketIO.Socket) => {
      console.log("A user connected: " + socket.id);

      this.joinRoom(socket);
      this.leaveRoom(socket);
      this.requestCommunicate(socket);
      this.allowCommunicate(socket);
      this.denyCommunicate(socket);
      this.kickOutUserFromRoom(socket);
      this.forceMuteUser(socket);
      this.requestManualVerify(socket);
      this.allowAccessRoom(socket);
      this.denyAccessRoom(socket);
      this.informVerified(socket);
      this.informAbsenceOfStudent(socket);
      this.warnUnusualAction(socket);


      socket.on("disconnect", async () => {
        try { 
          console.log(`Socket ${socket.id} disconnected`);
        // const userRoom = await service.getUserAndRoomFromSocket(socket.id);
        // const supervisors = await service.getSupervisorOfRoom(userRoom[0].room_id);
        // await service.leaveRoom(userRoom[0].room_id, userRoom[0].user_id);
        // supervisors.forEach(async (supervisor: any) => {
        //   this.io.to(await service.getSocketIdFromUserId(userRoom[0].room_id, supervisor.user_id)).emit("user-leaved", {
        //     roomId: userRoom[0].room_id,
        //     studentId: userRoom[0].user_id,
        //   });
        // });
      }
        catch (error) {
          console.log(error);
        }
      });
    });
  }

  private joinRoom(socket: socketIO.Socket) {
    socket.on("joinRoom", async (data: UserAndRoom) => {
      try {
        const { roomId, userId } = data;
        console.log(`User ${userId} join room ${roomId}`);

        socket.join(userId.toString());

        const supervisors = await service.getSupervisorOfRoom(roomId);
        const userInfo = await service.getUserInfo(userId);
        await service.joinRoom(roomId, userId, socket.id);
        console.log(supervisors);

        supervisors.forEach((supervisor: any) => {
          this.io.to(supervisor.user_id).emit("user-joined", {
            roomId: roomId, id: userId, socketId: socket.id,
            user_number: userInfo[0].user_number, full_name: userInfo[0].full_name
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private requestCommunicate(socket: socketIO.Socket) {
    socket.on("request-communicate", async (roomId: number, userId: number) => {
      try {
        console.log(`User ${userId} request communicate in room ${roomId}`);
        const supervisors = await service.getSupervisorOfRoom(roomId);
        supervisors.forEach(async (supervisor: any) => {
          this.io.to(await service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("request-communicate", {
            roomId,
            studentId: userId,
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private informAbsenceOfStudent(socket: socketIO.Socket) {
    socket.on("inform-absence", async (roomId: number, userId: number) => {
      try {
        console.log(`User ${userId} will absence in room ${roomId}`);
        const supervisors = await service.getSupervisorOfRoom(roomId);
        supervisors.forEach(async (supervisor: any) => {
          this.io.to(await service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("inform-absence", {
            roomId,
            studentId: userId,
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private allowCommunicate(socket: socketIO.Socket) {
    socket.on("allow-communicate", async (roomId: number, userId: number) => {
      try {
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        // socketId : socket of student
        this.io.to(studentSocketId).emit("allow-communicate", {
          // TODO: check data with front-end 
          roomId,
          student: userId,
          studentSocketId: studentSocketId,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private denyCommunicate(socket: socketIO.Socket) {
    socket.on("deny-communicate", async (roomId: number, userId: number) => {
      try {
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        // socketId : socket of student
        this.io.to(studentSocketId).emit("deny-communicate", {
          // TODO: check data with front-end 
          roomId,
          student: userId,
          studentSocketId: studentSocketId,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private kickOutUserFromRoom(socket: socketIO.Socket) {
    socket.on("kick-out", async (data: UserAndRoom) => {
      try {
        const { roomId, userId } = data; // socketId : socket of student
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        this.io.to(studentSocketId).emit("kick-out", {
          message: "You are kicked out from room",
        });
        this.io.of("/").sockets.get(studentSocketId)?.leave(roomId.toString());
      } catch (error) {
        console.log(error);
      }
    });
  }

  private forceMuteUser(socket: socketIO.Socket) {
    socket.on("force-mute", async (data: UserAndRoom) => {
      try {
        const { roomId, userId } = data; // socketId : socket of student
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        this.io.to(studentSocketId).emit("force-mute", {
          message: "You are forced to mute",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private warnUnusualAction(socket: socketIO.Socket) {
    socket.on("warn-unusual-action", async (data: {roomId: number, studentId: number, count: number}) => {
      try {
        const studentSocketId = await service.getSocketIdFromUserId(data.roomId, data.studentId);
        this.io.to(studentSocketId).emit("warn-unusual-action", {
          message: "You are warned for unusual action",
          count: data.count
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  public async informUnusualAction(action: UnusualAction) {
    try {
      const studentSocketId = await service.getSocketIdFromUserId(action.roomId, action.userId);
      const supervisors = await service.getSupervisorOfRoom(action.roomId);
      supervisors.forEach(async (supervisor: any) => {
        console.log(`Informing unusual action ${action.type} to supervisor ${supervisor.user_id} of student ${action.userId}`);
        this.io.to(await service.getSocketIdFromUserId(action.roomId, supervisor.user_id)).emit("unusual-action", action);
      });
      this.io.to(studentSocketId).emit("unusual-action", action);
    } catch (error) {
      console.log(error);
    }
  }

  private requestManualVerify(socket: socketIO.Socket) {
    socket.on("request-manual-verify", async (roomId: number, userId: number) => {
      try {
        console.log(`User ${userId} request manual verify in room ${roomId}`);
        const supervisors = await service.getSupervisorOfRoom(roomId);
        const userInfo = await service.getUserInfo(userId);
        supervisors.forEach(async (supervisor: any) => {
          this.io.to(await service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("request-manual-verify", {
            roomId,
            studentId: userId,
            user_number: userInfo[0].user_number,
            full_name: userInfo[0].full_name
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private informVerified(socket: socketIO.Socket) {
    socket.on("is-verified", async (roomId: number, userId: number) => {
      try {
        console.log(`User ${userId} is verified in room ${roomId}`);
        const supervisors = await service.getSupervisorOfRoom(roomId);
        const userInfo = await service.getUserInfo(userId);
        supervisors.forEach(async (supervisor: any) => {
          this.io.to(await service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("is-verified", {
            roomId,
            studentId: userId,
            user_number: userInfo[0].user_number,
            full_name: userInfo[0].full_name
          });
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private allowAccessRoom(socket: socketIO.Socket) {
    socket.on("allow-access", async (roomId: number, userId: number) => {
      try {
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        this.io.to(studentSocketId).emit("allow-access", {
          message: "You are allowed to access room",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private denyAccessRoom(socket: socketIO.Socket) {
    socket.on("deny-access", async (roomId: number, userId: number) => {
      try {
        const studentSocketId = await service.getSocketIdFromUserId(roomId, userId);
        this.io.to(studentSocketId).emit("deny-access", {
          message: "You are denied to access room",
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  private leaveRoom(socket: socketIO.Socket) {
    socket.on("leave-room", async ({ roomId, userId }: UserAndRoom) => {
      try {
        socket.leave(roomId.toString());
        console.log(`User ${userId} leave room ${roomId}`);
        // TODO : emit to teacher, client can get total join to room
        const supervisors = await service.getSupervisorOfRoom(roomId);
        supervisors.forEach(async (supervisor: any) => {
          this.io.to(await service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("user-leaved", { roomId, userId });
        });
        await service.leaveRoom(roomId, userId);
      } catch (error) {
        console.log(error);
      }
    });
  }

  public async triggerExamWhenStart() {
    try {
      const startDateAndEndDate = await service.getAllStartDateAndEndDateOfExam();
      startDateAndEndDate.forEach((exam: any) => {
        exam.start_date.setHours(exam.start_date.getHours() + 7); // For GMT+7
        schedule.scheduleJob(exam.start_date, async () => {
          this.io.emit(`exam-${exam.id}-start`, {
            message: `Exam ${exam.id} started`,
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  public Start() {
    this.triggerExamWhenStart();
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}.`);
    });
  }
}