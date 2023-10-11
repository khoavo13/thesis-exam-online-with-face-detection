"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
class SocketServer {
    constructor(port) {
        this.port = port;
        this.server = new http_1.default.Server();
        this.socket = new socket_io_1.default.Server(this.server);
        this.onlineUsers = [];
        this.socket.on("connection", (socket) => {
            console.log("A user connected: " + socket.id);
            this.joinRoom(socket);
            this.leaveRoom(socket);
            socket.on("disconnect", () => {
                console.log(`Socket ${socket.id} disconnected`);
            });
        });
    }
    joinRoom(socket) {
        socket.on("subscribe", (data) => {
            const { roomId, userId } = data;
            socket.join(roomId);
            let idx = this.onlineUsers.findIndex((room) => room.id === roomId);
            if (idx === -1) {
                this.onlineUsers.push({
                    id: roomId,
                    users: [
                        {
                            id: userId,
                            socketId: socket.id,
                        },
                    ],
                });
                idx = 0;
            }
            else {
                this.onlineUsers[idx].users.push({
                    id: userId,
                    socketId: socket.id,
                });
            }
            //   !this.onlineUsers.some((room) => room.id === roomId) &&
            //     this.onlineUsers.push({
            //       id: roomId,
            //       users: [
            //         {
            //           id: userId,
            //           socketId: socket.id,
            //         },
            //       ],
            //     });
            console.log(JSON.stringify(this.onlineUsers));
            this.socket.to(roomId).emit("getOnlineUsers", this.onlineUsers[idx]);
        });
    }
    leaveRoom(socket) {
        socket.on("unsubscribe", (roomId) => {
            const idx = this.onlineUsers.findIndex((room) => room.id === roomId);
            this.onlineUsers[idx].users = this.onlineUsers[idx].users.filter((user) => user.socketId === socket.id);
            console.log(JSON.stringify(this.onlineUsers));
            this.socket.to(roomId).emit("getOnlineUsers", this.onlineUsers[idx]);
        });
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`);
        });
    }
}
exports.SocketServer = SocketServer;
//# sourceMappingURL=web-socket.js.map