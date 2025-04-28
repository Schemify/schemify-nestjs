## Introducción

Esta guía muestra, de principio a fin, cómo **compilar los `.proto`, arrancar el microservicio `schemify-microservice-nestjs`, ejecutar las pruebas E2E y realizar pruebas manuales en Kreya**.

---

## Índice

1. [`Estructura del proyecto`](#1-estructura-del-proyecto)
2. [`Compilación de archivos .proto`](#2-compilación-de-archivos-proto)  
   2.1 [`Ubicación`](#21-ubicación-de-los-proto)  
   2.2 [`Comando estándar`](#22-comando-estándar-con-ts-proto)  
   2.3 [`Script reutilizable`](#23-script-reutilizable)  
   2.4 [`Movimiento de generados`](#24-movimiento-del-código-generado)
3. [`Arranque del microservicio`](#3-arranque-del-microservicio)
4. [`Ejecución de pruebas E2E (Jest)`](#4-ejecución-de-las-pruebas-e2e-jest)
5. [`Pruebas manuales con Kreya`](#5-pruebas-manuales-con-kreya)  
   5.1 [`Instalación`](#51-instalación-rápida)  
   5.2 [`Configuración mínima`](#52-configuración-mínima)  
   5.3 [`Ventajas y alternativas`](#53-ventajas-y-alternativas)
6. [`Tabla de comandos rápidos`](#6-anexo--tabla-de-comandos-rápidos)

---

### 1. Estructura del proyecto

```text
libs/
└─ proto/
   ├─ src/services/example_service/example.proto
   ├─ generated/services/example_service/example.ts
   └─ tsconfig.lib.json
apps/
└─ schemify-microservice-nestjs/
   ├─ src/…                 # código Nest
   └─ test/grpc.e2e.spec.ts # pruebas E2E
```

---

### 2. Compilación de archivos `.proto`

#### 2.1 Ubicación de los `.proto`

Todos los contratos fuente viven en **`libs/proto/src/services/**`\*\*.

#### 2.2 Comando estándar con `ts-proto`

```bash
# Ejecutar desde la raíz
npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd \
  --ts_proto_out=./ \
  --ts_proto_opt=nestJs=true \
  ./libs/proto/src/services/example_service/example.proto
```

#### 2.3 Script reutilizable

```bash
npx protoc \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd \
  --ts_proto_out=./ \
  --ts_proto_opt=nestJs=true \
  ./apps/${MICRO}/src/${MOD}/infraestructure/grpc/proto/${ORIGEN}/${FILE}.proto
```

#### 2.4 Movimiento del código generado

```bash
mv libs/proto/src/services/example_service/example.ts \
   libs/proto/generated/services/example_service/
```

---

### 3. Arranque del microservicio

```json
// package.json
"scripts": {
  "start:schemify": "NODE_ENV=development nest start --watch schemify-microservice-nestjs"
}
```

```bash
npm run start:schemify
# → ✅ Microservicio gRPC listo en puerto 50051
```

---

### 4. Ejecución de las pruebas E2E (Jest)

```bash
# terminal 1: microservicio encendido
# terminal 2:
npm run test:e2e          # jest --config ./jest.config.ts
```

---

### 5. Pruebas manuales con Kreya

#### 5.1 Instalación rápida

Descarga la versión gratuita: <https://kreya.app/>

#### 5.2 Configuración mínima

1. **Nuevo Proyecto → gRPC**
2. Endpoint → `http://localhost:50051` (o `dns:localhost:50051`)
3. Importar `example.proto`
4. Seleccionar servicio **example.ExampleService**
5. Elegir RPC, cuerpo `{}`, **Send** → ver respuesta.

#### 5.3 Ventajas y alternativas

| Herramienta   | UI  | Streaming | Licencia         |
| ------------- | --- | --------- | ---------------- |
| **Kreya**     | ✔  | ✔        | Free&nbsp;/ Pro  |
| BloomRPC      | ✔  | Limitado  | Free             |
| Insomnia gRPC | ✔  | ✔        | Free&nbsp;/ Paid |
| grpcurl (CLI) | ✖  | ✔        | Free             |

---

### 6. Anexo – tabla de comandos rápidos

| Acción                 | Comando                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Compilar proto único   | `npx protoc --plugin=... --ts_proto_out=./ --ts_proto_opt=nestJs=true ./libs/proto/src/services/example_service/example.proto` |
| Mover archivo generado | `mv libs/proto/src/services/example_service/example.ts libs/proto/generated/services/example_service/`                         |
| Levantar microservicio | `npm run start:schemify`                                                                                                       |
| Correr pruebas E2E     | `npm run test:e2e`                                                                                                             |
| Probar vía CLI         | `grpcurl -plaintext -d '{}' localhost:50051 example.ExampleService.GetAllExamples`                                             |

> Con esta guía podrás **compilar tus contratos, levantar el servicio, ejecutar pruebas automatizadas y testear manualmente con Kreya** sin perderte en rutas ni configuraciones. ¡Feliz desarrollo!
