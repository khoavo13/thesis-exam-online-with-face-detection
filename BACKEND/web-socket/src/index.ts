import { getGrpcServer } from "./grpc-server/grpc.server"
import { SocketServer } from "./socket-server/socket";
import grpc from "@grpc/grpc-js";

const port: number = 4000;

const server = new SocketServer(port);

server.Start();


let grpcServer = getGrpcServer(server);

grpcServer.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:50051");
      grpcServer.start();
    }
  );
