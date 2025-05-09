#!/bin/bash

RAW_NAME="$1"

# kebab-case - ejemplo: my-awesome-service
NAME=$(echo "$RAW_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')

# PascalCase - ejemplo: MyAwesomeService
CLASS_NAME=$(echo "$RAW_NAME" | sed -E 's/[^a-zA-Z0-9]+/ /g' | awk '{for(i=1;i<=NF;++i) $i=toupper(substr($i,1,1)) tolower(substr($i,2))} 1' | tr -d ' ')

# camelCase - ejemplo: myAwesomeService
INSTANCE_NAME=$(echo "$CLASS_NAME" | sed -E 's/^([A-Z])/\L\1/')

SNAKE_NAME=$(echo "$RAW_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/_/g' | sed -E 's/^_+|_+$//g')


PROJECT_ROOT=$(realpath "$(dirname "$0")/..")
DEST="$PROJECT_ROOT/libs/proto"

echo "📥 Nombre original: $RAW_NAME"
echo "🔧 kebab-case (NAME): $NAME"
echo "🏛️ PascalCase (CLASS_NAME): $CLASS_NAME"
echo "🐍 camelCase (INSTANCE_NAME): $INSTANCE_NAME"

# ─── Crear carpetas base ──────────────────────────────────────────────────
mkdir -p "$DEST/src/services/$SNAKE_NAME"

# ? ─── $DEST/src/services/$NAME/$INSTANCE_NAME.proto ──────────────────────

# * libs/proto/src/services/$NAME/$INSTANCE_NAME.proto
cat <<EOF > $DEST/src/services/$SNAKE_NAME/$SNAKE_NAME.proto
syntax = "proto3";

package $SNAKE_NAME;

// ───── Servicio CRUD ────────────────────────────────────────────
service ${CLASS_NAME}Service {
  rpc Create${CLASS_NAME}(Create${CLASS_NAME}Dto) returns (${CLASS_NAME}) {}
  rpc GetAll${CLASS_NAME}s(${CLASS_NAME}Empty) returns (${CLASS_NAME}s) {}
  rpc Get${CLASS_NAME}ById(GetByIdDto) returns (${CLASS_NAME}) {}
  rpc Update${CLASS_NAME}(Update${CLASS_NAME}Dto) returns (${CLASS_NAME}) {}
  rpc Delete${CLASS_NAME}(GetByIdDto) returns (${CLASS_NAME}Empty) {}

  // opcional: paginación
  // rpc Query${CLASS_NAME}s(PaginationDto) returns (${CLASS_NAME}s) {}
}

// ───── DTOs y Mensajes ─────────────────────────────────────────

message ${CLASS_NAME}Empty {}

message GetByIdDto {
  string id = 1;
}

message Create${CLASS_NAME}Dto {
  string name = 1;
  optional string description = 2;
  // agregar más campos si es necesario
}

message Update${CLASS_NAME}Dto {
  string id = 1;
  Update${CLASS_NAME}Data data = 2;
}

message Update${CLASS_NAME}Data {
  string name = 1;
  optional string description = 2;
  // más campos opcionales
}

message ${CLASS_NAME} {
  string id = 1;
  string name = 2;
  optional string description = 3;
  // campos adicionales si aplica
}

message ${CLASS_NAME}s {
  repeated ${CLASS_NAME} items = 1;
}
EOF

npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd \
  --ts_proto_out=${DEST}/generated \
  --ts_proto_opt=nestJs=true,outputServices=grpc-js,useOptionals=all \
  --proto_path=${DEST}/src \
  $DEST/src/services/$SNAKE_NAME/$SNAKE_NAME.proto

# Paths
ROOT_INDEX="$DEST/generated/index.ts"
SERVICES_INDEX="$DEST/generated/services/index.ts"
SERVICE_FOLDER="$DEST/generated/services/$SNAKE_NAME"
SERVICE_INDEX="$SERVICE_FOLDER/index.ts"

SERVICE_EXPORT_LINE="export * from './$SNAKE_NAME';"

# 1. ROOT: export * from './services';
mkdir -p "$(dirname "$ROOT_INDEX")"
touch "$ROOT_INDEX"
grep -Fxq "export  from './services'" "$ROOT_INDEX" || echo "export * from './services'" >> "$ROOT_INDEX"

# 2. SERVICES: export * from './usuarios_gestor';
mkdir -p "$(dirname "$SERVICES_INDEX")"
touch "$SERVICES_INDEX"
grep -Fxq "$SERVICE_EXPORT_LINE" "$SERVICES_INDEX" || echo "$SERVICE_EXPORT_LINE" >> "$SERVICES_INDEX"

# 3. SERVICIO: export con alias para evitar colisiones
mkdir -p "$SERVICE_FOLDER"
touch "$SERVICE_INDEX"

# Solo añade si no está presente
if ! grep -q "export {" "$SERVICE_INDEX"; then
  echo "export {" >> "$SERVICE_INDEX"
  echo "  Empty as ${CLASS_NAME}Empty," >> "$SERVICE_INDEX"
  echo "  protobufPackage as ${CLASS_NAME}Package," >> "$SERVICE_INDEX"
  echo "  ${CLASS_NAME}ServiceClient," >> "$SERVICE_INDEX"
  echo "  ${CLASS_NAME}ServiceController," >> "$SERVICE_INDEX"
  echo "  ${CLASS_NAME}ServiceControllerMethods," >> "$SERVICE_INDEX"
  echo "  ${CLASS_NAME}_SERVICE_NAME," >> "$SERVICE_INDEX"
  echo "} from './$SNAKE_NAME';" >> "$SERVICE_INDEX"
fi
