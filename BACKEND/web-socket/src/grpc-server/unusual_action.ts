import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { UnusualActionClient as _UnusualActionClient, UnusualActionDefinition as _UnusualActionDefinition } from './UnusualAction';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  InformUnusualActionRequest: MessageTypeDefinition
  InformUnusualActionResponse: MessageTypeDefinition
  UnusualAction: SubtypeConstructor<typeof grpc.Client, _UnusualActionClient> & { service: _UnusualActionDefinition }
  google: {
    protobuf: {
      Timestamp: MessageTypeDefinition
    }
  }
}

