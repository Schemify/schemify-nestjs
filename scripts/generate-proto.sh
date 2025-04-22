#!/bin/bash

# Variables
PROTOC_GEN_TS_PROTO="./node_modules/.bin/protoc-gen-ts_proto.cmd"
PROTOC_OUT_DIR="./"
PROTOC_OPTS="nestJs=true"

# Función para compilar proto
compile_proto() {
    local proto_file_dir=$1
    local out_dir=$2
    echo "Compilando proto en el directorio: $proto_file_dir"
    npx protoc --plugin=$PROTOC_GEN_TS_PROTO --ts_proto_out=$out_dir --ts_proto_opt=$PROTOC_OPTS $proto_file_dir/**/*.proto
}

# Preguntar si los archivos son internos o externos
read -p "¿Son los archivos .proto internos o externos? (internos/externos): " proto_type

if [[ "$proto_type" == "externos" ]]; then
    # Si son externos, compilar en un directorio específico para externos
    EXTERNAL_PROTO_DIR="./external_proto"
    EXTERNAL_OUT_DIR="./external_generated"
    
    echo "Compilando archivos .proto externos desde $EXTERNAL_PROTO_DIR..."
    compile_proto $EXTERNAL_PROTO_DIR $EXTERNAL_OUT_DIR

elif [[ "$proto_type" == "internos" ]]; then
    # Si son internos, compilar en un directorio para internos
    INTERNAL_PROTO_DIR="./proto"
    INTERNAL_OUT_DIR="./internal_generated"
    
    echo "Compilando archivos .proto internos desde $INTERNAL_PROTO_DIR..."
    compile_proto $INTERNAL_PROTO_DIR $INTERNAL_OUT_DIR

else
    echo "Opción no válida. Por favor, ingresa 'internos' o 'externos'."
    exit 1
fi

echo "Compilación completa."
