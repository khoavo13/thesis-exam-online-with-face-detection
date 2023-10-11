import grpc
from .proto import unusual_action_pb2_grpc as pb2_grpc
from .proto import unusual_action_pb2  as pb2


class SocketClient(object):
    def __init__(self):
        self.host = 'localhost'
        self.server_port = 50051

        # instantiate a channel
        self.channel = grpc.insecure_channel(
            '{}:{}'.format(self.host, self.server_port))

        # bind the client and the server
        self.stub = pb2_grpc.UnusualActionStub(self.channel)

    def send(self, actionType, description, occur_at, room_id, user_id):
        """
        Client function to call the rpc for GetServerResponse
        """
        request = pb2.InformUnusualActionRequest(type=actionType, description=description, occurAt=occur_at, roomId=room_id, userId=user_id)
        print(f'{request}')
        return self.stub.InformUnusualAction(request)