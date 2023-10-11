"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrpcServer = void 0;
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const proto_loader_1 = __importDefault(require("@grpc/proto-loader"));
var PROTO_PATH = __dirname + "../../../../proto/unusual_action.proto";
var packageDefinition = proto_loader_1.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const unusualActionProto = grpc_js_1.loadPackageDefinition(packageDefinition);
const getGrpcServer = (socketServer) => {
    const server = new grpc_js_1.Server();
    server.addService(unusualActionProto.UnusualAction.service, {
        InformUnusualAction: (call, callback) => {
            console.log("OrderIceCream", call.request);
            socketServer.informUnusualAction(call.request);
            callback(null, { message: "success" });
        },
    });
    return server;
};
exports.getGrpcServer = getGrpcServer;
//# sourceMappingURL=grpc.server.js.map