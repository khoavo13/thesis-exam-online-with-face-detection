import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./unusual_action";
import { SocketServer } from "../socket-server/socket";

var PROTO_PATH = __dirname + "../../../../proto/unusual_action.proto";
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const unusualActionProto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;


export const getGrpcServer = (socketServer: SocketServer) => { 
    const server = new grpc.Server();
    server.addService(unusualActionProto.UnusualAction.service, {
        InformUnusualAction : (call : any, callback: any) => {
            console.log("OrderIceCream", call.request);
            socketServer.informUnusualAction(call.request);
            callback(null, {message: "success"});
        },
      });

      return server;
}
