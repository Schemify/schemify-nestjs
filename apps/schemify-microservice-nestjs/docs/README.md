Compilar proto

<!-- npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/example.proto -->

### Compilar proto


Ejemplo de comando para compilar un proto a ts usando el plugin ts-proto y generando el código para NestJS.

```bash
# Compilar proto

npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./apps/schemify-microservice-nestjs/src/example/infraestructure/grpc/proto/internal/example.proto

```
Luego he de mover el archivo generado a la carpeta de genereated dentro del propio directorio donde se


Opción reusable para el plugin ts-proto:

```bash
# Opción reusable para el plugin ts-proto

npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./apps/${NOMBRE_MICROSERVICIO}/src/${NOMBRE_MODULO}/infraestructure/grpc/proto/${ORIGEN} /${NOMBRE_ARCHIVO}.proto

```