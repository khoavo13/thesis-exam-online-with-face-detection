"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const service = __importStar(require("./service"));
class SocketServer {
    constructor(port) {
        this.port = port;
        this.server = new http_1.default.Server();
        this.io = new socket_io_1.default.Server(this.server, {
            cors: {
                origin: '*',
            }
        });
        this.io.on("connection", (socket) => {
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
            socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
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
            }));
        });
    }
    joinRoom(socket) {
        socket.on("joinRoom", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, userId } = data;
                console.log(`User ${userId} join room ${roomId}`);
                socket.join(userId.toString());
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                const userInfo = yield service.getUserInfo(userId);
                yield service.joinRoom(roomId, userId, socket.id);
                console.log(supervisors);
                supervisors.forEach((supervisor) => {
                    this.io.to(supervisor.user_id).emit("user-joined", {
                        roomId: roomId, id: userId, socketId: socket.id,
                        user_number: userInfo[0].user_number, full_name: userInfo[0].full_name
                    });
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    requestCommunicate(socket) {
        socket.on("request-communicate", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`User ${userId} request communicate in room ${roomId}`);
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(yield service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("request-communicate", {
                        roomId,
                        studentId: userId,
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    informAbsenceOfStudent(socket) {
        socket.on("inform-absence", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`User ${userId} will absence in room ${roomId}`);
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(yield service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("inform-absence", {
                        roomId,
                        studentId: userId,
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    allowCommunicate(socket) {
        socket.on("allow-communicate", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                // socketId : socket of student
                this.io.to(studentSocketId).emit("allow-communicate", {
                    // TODO: check data with front-end 
                    roomId,
                    student: userId,
                    studentSocketId: studentSocketId,
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    denyCommunicate(socket) {
        socket.on("deny-communicate", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                // socketId : socket of student
                this.io.to(studentSocketId).emit("deny-communicate", {
                    // TODO: check data with front-end 
                    roomId,
                    student: userId,
                    studentSocketId: studentSocketId,
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    kickOutUserFromRoom(socket) {
        socket.on("kick-out", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { roomId, userId } = data; // socketId : socket of student
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                this.io.to(studentSocketId).emit("kick-out", {
                    message: "You are kicked out from room",
                });
                (_a = this.io.of("/").sockets.get(studentSocketId)) === null || _a === void 0 ? void 0 : _a.leave(roomId.toString());
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    forceMuteUser(socket) {
        socket.on("force-mute", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId, userId } = data; // socketId : socket of student
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                this.io.to(studentSocketId).emit("force-mute", {
                    message: "You are forced to mute",
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    warnUnusualAction(socket) {
        socket.on("warn-unusual-action", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(data.roomId, data.studentId);
                this.io.to(studentSocketId).emit("warn-unusual-action", {
                    message: "You are warned for unusual action",
                    count: data.count
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    informUnusualAction(action) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(action.roomId, action.userId);
                const supervisors = yield service.getSupervisorOfRoom(action.roomId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    console.log(`Informing unusual action ${action.type} to supervisor ${supervisor.user_id} of student ${action.userId}`);
                    this.io.to(yield service.getSocketIdFromUserId(action.roomId, supervisor.user_id)).emit("unusual-action", action);
                }));
                this.io.to(studentSocketId).emit("unusual-action", action);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    requestManualVerify(socket) {
        socket.on("request-manual-verify", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`User ${userId} request manual verify in room ${roomId}`);
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                const userInfo = yield service.getUserInfo(userId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(yield service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("request-manual-verify", {
                        roomId,
                        studentId: userId,
                        user_number: userInfo[0].user_number,
                        full_name: userInfo[0].full_name
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    informVerified(socket) {
        socket.on("is-verified", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`User ${userId} is verified in room ${roomId}`);
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                const userInfo = yield service.getUserInfo(userId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(yield service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("is-verified", {
                        roomId,
                        studentId: userId,
                        user_number: userInfo[0].user_number,
                        full_name: userInfo[0].full_name
                    });
                }));
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    allowAccessRoom(socket) {
        socket.on("allow-access", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                this.io.to(studentSocketId).emit("allow-access", {
                    message: "You are allowed to access room",
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    denyAccessRoom(socket) {
        socket.on("deny-access", (roomId, userId) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentSocketId = yield service.getSocketIdFromUserId(roomId, userId);
                this.io.to(studentSocketId).emit("deny-access", {
                    message: "You are denied to access room",
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    leaveRoom(socket) {
        socket.on("leave-room", ({ roomId, userId }) => __awaiter(this, void 0, void 0, function* () {
            try {
                socket.leave(roomId.toString());
                console.log(`User ${userId} leave room ${roomId}`);
                // TODO : emit to teacher, client can get total join to room
                const supervisors = yield service.getSupervisorOfRoom(roomId);
                supervisors.forEach((supervisor) => __awaiter(this, void 0, void 0, function* () {
                    this.io.to(yield service.getSocketIdFromUserId(roomId, supervisor.user_id)).emit("user-leaved", { roomId, userId });
                }));
                yield service.leaveRoom(roomId, userId);
            }
            catch (error) {
                console.log(error);
            }
        }));
    }
    triggerExamWhenStart() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDateAndEndDate = yield service.getAllStartDateAndEndDateOfExam();
                startDateAndEndDate.forEach((exam) => {
                    exam.start_date.setHours(exam.start_date.getHours() + 7); // For GMT+7
                    node_schedule_1.default.scheduleJob(exam.start_date, () => __awaiter(this, void 0, void 0, function* () {
                        this.io.emit(`exam-${exam.id}-start`, {
                            message: `Exam ${exam.id} started`,
                        });
                    }));
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    Start() {
        this.triggerExamWhenStart();
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket.js.map