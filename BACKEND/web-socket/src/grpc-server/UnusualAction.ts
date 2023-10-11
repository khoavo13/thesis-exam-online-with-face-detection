// Original file: ../proto/unusual_action.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { InformUnusualActionRequest as _InformUnusualActionRequest, InformUnusualActionRequest__Output as _InformUnusualActionRequest__Output } from './InformUnusualActionRequest';
import type { InformUnusualActionResponse as _InformUnusualActionResponse, InformUnusualActionResponse__Output as _InformUnusualActionResponse__Output } from './InformUnusualActionResponse';

export interface UnusualActionClient extends grpc.Client {
  InformUnusualAction(argument: _InformUnusualActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  InformUnusualAction(argument: _InformUnusualActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  InformUnusualAction(argument: _InformUnusualActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  InformUnusualAction(argument: _InformUnusualActionRequest, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  informUnusualAction(argument: _InformUnusualActionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  informUnusualAction(argument: _InformUnusualActionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  informUnusualAction(argument: _InformUnusualActionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  informUnusualAction(argument: _InformUnusualActionRequest, callback: grpc.requestCallback<_InformUnusualActionResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface UnusualActionHandlers extends grpc.UntypedServiceImplementation {
  InformUnusualAction: grpc.handleUnaryCall<_InformUnusualActionRequest__Output, _InformUnusualActionResponse>;
  
}

export interface UnusualActionDefinition extends grpc.ServiceDefinition {
  InformUnusualAction: MethodDefinition<_InformUnusualActionRequest, _InformUnusualActionResponse, _InformUnusualActionRequest__Output, _InformUnusualActionResponse__Output>
}
