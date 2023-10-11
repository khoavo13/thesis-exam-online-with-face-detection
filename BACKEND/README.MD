# Generate
### Gen to Python : 
python -m grpc_tools.protoc -I. --python_out=./facerecognition/app/grpc --grpc_python_out=./facerecognition/app/grpc ./proto/unusual_action.proto \

### Gen to Javascript : 
cd to web-socket \ 
yarn proto-loader-gen-types --grpcLib=@grpc/grpc-js --outDir=./src/grpc-server ../proto/unusual_action.proto
