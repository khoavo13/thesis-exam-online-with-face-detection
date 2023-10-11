"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_server_1 = require("./grpc-server/grpc.server");
const socket_1 = require("./socket-server/socket");
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const port = 4000;
const server = new socket_1.SocketServer(port);
server.Start();
let grpcServer = (0, grpc_server_1.getGrpcServer)(server);
grpcServer.bindAsync("127.0.0.1:50051", grpc_js_1.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    grpcServer.start();
});
//# sourceMappingURL=index.js.map