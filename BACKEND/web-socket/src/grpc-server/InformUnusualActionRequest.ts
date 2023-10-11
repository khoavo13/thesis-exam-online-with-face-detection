// Original file: ../proto/unusual_action.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface InformUnusualActionRequest {
  'type'?: (string);
  'description'?: (string);
  'occurAt'?: (_google_protobuf_Timestamp | null);
  'roomId'?: (number | string | Long);
  'userId'?: (number | string | Long);
}

export interface InformUnusualActionRequest__Output {
  'type'?: (string);
  'description'?: (string);
  'occurAt'?: (_google_protobuf_Timestamp__Output);
  'roomId'?: (Long);
  'userId'?: (Long);
}
