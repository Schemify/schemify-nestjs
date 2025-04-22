#!/bin/bash
OUT_DIR="./generated"
PROTO_DIR="./src"

# Generar código para todos los protos
find $PROTO_DIR -name '*.proto' | xargs \
protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=$OUT_DIR \
  --ts_proto_opt=outputServices=grpc-js \
  --ts_proto_opt=esModuleInterop=true \
  -I $PROTO_DIR