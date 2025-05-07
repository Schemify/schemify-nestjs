#!/bin/bash

# ./init-microservice.sh usuarios-gestor

# ─── Leer y normalizar nombre ─────────────────────────────────────────
RAW_NAME="$1"

# NAME = kebab-case, minúsculas, guiones
NAME=$(echo "$RAW_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')

# CLASS_NAME = conservar mayúsculas, eliminar separadores
CLASS_NAME=$(echo "$RAW_NAME" | sed -E 's/[^a-zA-Z0-9]+/ /g' | awk '{for(i=1;i<=NF;++i) $i=toupper(substr($i,1,1)) tolower(substr($i,2))} 1' | tr -d ' ')

# INSTANCE_NAME = CLASS_NAME con minúscula inicial
INSTANCE_NAME=$(echo "$CLASS_NAME" | sed -E 's/^([A-Z])/\L\1/')

CAMEL_CASE_NAME=$(echo "$RAW_NAME" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+//g')

# 📦 Generando microservicio: gestioon-de-usuarios
# 📂 Directorio destino: apps/gestioon-de-usuarios
# 🏛️  Clase base: GestioonDeUsuarios
# 🐍 Instancia: gestioonDeUsuarios

PROJECT_ROOT=$(realpath "$(dirname "$0")/..")
DEST="$PROJECT_ROOT/apps/$NAME"

echo "📦 Generando microservicio: $NAME"
echo "📂 Directorio destino: $DEST"
echo "🏛️  Clase base: $CLASS_NAME"
echo "🐍 Instancia: $INSTANCE_NAME"


# ─── Crear carpetas base ─────────────────────────────────────────────
mkdir -p $DEST/{docs,prisma/migrations,src/$NAME/{application/{dtos,mappers,services,use-cases},domain/{entities,events,repositories,value-objects},infrastructure/{config,controllers,exceptions,interceptors,messaging/kafka/consumers,modules,persistence/{mongodb,prisma}}},test}

# ─── Archivos con contenido ──────────────────────────────────────────

# * ${DEST}/Dockerfile
cat <<EOF > $DEST/Dockerfile
# -----------------------------
# 🏗 Stage 1: Builder
# -----------------------------
FROM node:23-slim AS builder

ENV HUSKY=0
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build 

# -----------------------------
# 🚀 Stage 2: Runtime
# -----------------------------
FROM node:23-slim AS runtime

RUN apt-get update -y && apt-get install -y openssl

ENV NODE_ENV=production \
    PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/apps/${NAME}/src ./dist/apps/${NAME}/src
COPY --from=builder /app/apps/${NAME}/prisma ./prisma
COPY --from=builder /app/libs/proto ./dist/apps/${NAME}/proto

# Exponer el puerto gRPC
EXPOSE 50051

CMD ["sh", "-c", "npx prisma generate --schema=prisma/schema.prisma && npx prisma migrate deploy --schema=prisma/schema.prisma && node dist/apps/${NAME}/src/main"]
EOF

# * ${DEST}/jest-e2e.config.ts
cat <<EOF > $DEST/jest-e2e.config.ts
import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  displayName: '${NAME}',
  rootDir: './test',
  testRegex: '.e2e-spec.ts$',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testTimeout: 10_000
}

export default config
EOF

# * ${DEST}/schema.prisma
cat <<EOF > $DEST/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ${CLASS_NAME} {
  id String @id @default(uuid())
}
EOF

# ? ─── src ──────────────────────────────────────────

# * src/tsconfig.app.json
cat <<EOF > $DEST/src/tsconfig.app.json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": false,
    "outDir": "../../dist/apps/$NAME"
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*spec.ts",
    "test/**/*.ts",
    "test/jest-e2e.config.js"
  ]
}
EOF

# * src/main.ts
cat <<EOF > $DEST/src/main.ts
import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'

// ! Actualizar el nombre del paquete
import { EXAMPLE_PACKAGE_NAME } from '@app/proto'
import { join } from 'path'

import { GrpcLoggingInterceptor } from './$NAME/infrastructure/interceptors/grpc-logging.interceptor'

import { kafkaCommonConfig } from './$NAME/infrastructure/config/kafka.config'

// import { Partitioners } from 'kafkajs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const logger = new Logger('${NAME}Microservice')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      // ! Actualizar el nombre del paquete
      package: EXAMPLE_PACKAGE_NAME,
      protoPath: join(
        __dirname,
        // ! Actualizar el nombre del paquete
        '../proto/src/services/${NAME}_service/${NAME}.proto'
      ),
      url: '0.0.0.0:50051'
    }
  })

  if (process.env.NODE_ENV === 'development') {
    app.useGlobalInterceptors(new GrpcLoggingInterceptor())
  }

  // 3. Configurar Kafka (para consumir mensajes asíncronos)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,

    options: {
      ...kafkaCommonConfig,
      consumer: {
        groupId: '${NAME}-microservice-nestjs-consumer',
        allowAutoTopicCreation: false
      }
    }
  })

  // 4. Iniciar los microservicios
  await app.startAllMicroservices()
  logger.log('✅ Microservicio gRPC listo en puerto 50051')

  if (process.env.NODE_ENV === 'development') {
    app.useGlobalInterceptors(new GrpcLoggingInterceptor())
    logger.verbose(
      '🧪 Modo desarrollo activado, interceptor de logging habilitado'
    )
  } else {
    logger.log(\`🚀 Modo producción: NODE_ENV=\${process.env.NODE_ENV}\`)
  }

  await app.init()
}

bootstrap().catch((err) => {
  console.error('Error al iniciar el microservicio:', err)
  process.exit(1)
})
EOF

# * src/app.module.ts
cat <<EOF > $DEST/src/app.module.ts
import { Module } from '@nestjs/common'

import { ${CLASS_NAME}Module } from './${NAME}/${NAME}.module'

@Module({
  imports: [${CLASS_NAME}Module],
  controllers: [],
  providers: []
})
export class AppModule {}
EOF


# ? ─── src/${NAME} ────────────────────────────────────

# * src/${NAME}/${NAME}.module.ts  
cat <<EOF > $DEST/src/$NAME/$NAME.module.ts
import { Module } from '@nestjs/common'

import { ${CLASS_NAME}InfrastructureModule } from './infrastructure/modules/${NAME}.module'
import { ${CLASS_NAME}ApplicationService } from './application/services/${NAME}-application.service'

@Module({
  imports: [${CLASS_NAME}InfrastructureModule],
  controllers: [],
  providers: [${CLASS_NAME}ApplicationService],
  exports: []
})
export class ${CLASS_NAME}Module {}
EOF

# ? ─── src/${NAME}/application ────────────────────────────────────

# * src/${NAME}/aplication/dtos/create-${NAME}.dto.ts
cat <<EOF > $DEST/src/$NAME/application/dtos/create-${NAME}.dto.ts
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class Create${CLASS_NAME}Dto {
  @IsString()
  @MinLength(3)
  name: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string
}
EOF

# * src/${NAME}/aplication/dtos/update-${NAME}.dto.ts
cat <<EOF > $DEST/src/$NAME/application/dtos/update-${NAME}.dto.ts
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class Update${CLASS_NAME}Dto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string
}
EOF

# * src/${NAME}/aplication/mappers/${NAME}.mapper.ts
cat <<EOF > $DEST/src/$NAME/application/mappers/$NAME.mapper.ts
import { ${CLASS_NAME}Entity } from '../../domain/entities/${NAME}.entity'

import { Create${CLASS_NAME}Dto } from '../dtos/create-${NAME}.dto'
import { Update${CLASS_NAME}Dto } from '../dtos/update-${NAME}.dto'

// TODO: Cambiar por tus propias importaciones de proto
import {
  Create${CLASS_NAME}Dto as ProtoCreate${CLASS_NAME}Dto,
  Update${CLASS_NAME}Dto as ProtoUpdate${CLASS_NAME}Dto,
  ${CLASS_NAME} as Proto${CLASS_NAME}
} from 'libs/proto/generated'

export class ${CLASS_NAME}Mapper {
  protoToCreateDto(protoDto: ProtoCreate${CLASS_NAME}Dto): Create${CLASS_NAME}Dto {
    return {
      name: protoDto.name,
      description: protoDto.description
      // Mapear otros campos según sea necesario
    }
  }

  protoToUpdateDto(protoDto: ProtoUpdate${CLASS_NAME}Dto): Update${CLASS_NAME}Dto {
    return {
      name: protoDto.${CAMEL_CASE_NAME}?.name || undefined,
      description: protoDto.${CAMEL_CASE_NAME}?.description || undefined
    }
  }

  entityToProtoResponse(entity: ${CLASS_NAME}Entity): Proto${CLASS_NAME} {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description.value
      // createdAt: entity.createdAt.toISOString(),
      // updatedAt: entity.updatedAt?.toISOString() || ''
    }
  }
}
EOF

# * src/${NAME}/application/services/${NAME}-application.service.ts
cat <<EOF > $DEST/src/$NAME/application/services/$NAME-application.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Create${CLASS_NAME}Dto } from '../dtos/create-${NAME}.dto'
import { ${CLASS_NAME}Entity } from '../../domain/entities/${NAME}.entity'
import { ${CLASS_NAME}Repository } from '../../domain/repositories/${NAME}.repository'

@Injectable()
export class ${CLASS_NAME}ApplicationService {
  constructor(
    @Inject('${CLASS_NAME}Repository') private readonly repository: ${CLASS_NAME}Repository
  ) {}

  async create(dto: Create${CLASS_NAME}Dto): Promise<${CLASS_NAME}Entity> {
    const ${CAMEL_CASE_NAME} = ${CLASS_NAME}Entity.create(dto)
    return this.repository.save(${CAMEL_CASE_NAME})
  }

  async findOne(id: string): Promise<${CLASS_NAME}Entity> {
    const entity = await this.repository.findById(id)

    if (!entity) {
      throw new NotFoundException(\`${CLASS_NAME} with id \${id} not found\`)
    }

    return entity
  }

  async findAll(): Promise<${CLASS_NAME}Entity[]> {
    return this.repository.findAll()
  }

  async update(
    id: string,
    dto: Partial<Create${CLASS_NAME}Dto>
  ): Promise<${CLASS_NAME}Entity> {
    const entity = await this.findOne(id)
    entity.update(dto)
    return this.repository.save(entity)
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id)

    try {
      if (!entity) {
        throw new NotFoundException(\`${CLASS_NAME} with id \${id} not found\`)
      }
      await this.repository.delete(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(\`Error deleting ${NAME} with id \${id}: \${error.message}\`)
    }
  }
}
EOF


# * src/${NAME}/aplication/use-cases/create-${NAME}.use-case.ts
cat <<EOF > $DEST/src/$NAME/application/use-cases/create-${NAME}.use-case.ts
export class Create${CLASS_NAME}UseCase {
  // TODO: implementar caso de uso
}
EOF

# ? ─── src/${NAME}/domain ─────────────────────────────────────────

# * src/${NAME}/domain/entities/${NAME}.entity.ts
cat <<EOF > $DEST/src/$NAME/domain/entities/${NAME}.entity.ts
import { DescriptionValueObject } from '../value-objects/description.value-object'
import { v4 as uuidv4 } from 'uuid'

export class ${CLASS_NAME}Entity {
  readonly id: string
  name: string
  description: DescriptionValueObject
  readonly createdAt: Date
  updatedAt?: Date

  private constructor(props: {
    id?: string
    name: string
    description: DescriptionValueObject
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.id = props.id || uuidv4()
    this.name = props.name
    this.description = props.description
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt
  }

  static create(props: { name: string; description?: string }): ${CLASS_NAME}Entity {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('Name must be at least 3 characters')
    }

    return new ${CLASS_NAME}Entity({
      name: props.name,
      description: DescriptionValueObject.create(props.description || '')
    })
  }

  update(props: { name?: string; description?: string }): void {
    if (props.name) {
      if (props.name.trim().length < 3) {
        throw new Error('Name must be at least 3 characters')
      }
      this.name = props.name
    }

    if (props.description !== undefined) {
      this.description = DescriptionValueObject.create(props.description)
    }

    this.updatedAt = new Date()
  }

  static reconstruct(props: {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt?: Date
  }): ${CLASS_NAME}Entity {
    // reconstrucción desde persistencia
    return new ${CLASS_NAME}Entity({
      id: props.id,
      name: props.name,
      description: DescriptionValueObject.create(props.description),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
EOF

# * src/${NAME}/domain/repositories/${NAME}.repository.ts
cat <<EOF > $DEST/src/$NAME/domain/repositories/$NAME.repository.ts
import { ${CLASS_NAME}Entity } from '../entities/${NAME}.entity'
export interface ${CLASS_NAME}Repository {
  save(entity: ${CLASS_NAME}Entity): Promise<${CLASS_NAME}Entity>
  findById(id: string): Promise<${CLASS_NAME}Entity | null>
  findAll(): Promise<${CLASS_NAME}Entity[]>
  update(id: string, entity: ${CLASS_NAME}Entity): Promise<${CLASS_NAME}Entity>
  delete(id: string): Promise<void>
}
EOF

# * src/${NAME}/domain/value-objects/description.value-object.ts
cat <<EOF > $DEST/src/$NAME/domain/value-objects/description.value-object.ts
export class DescriptionValueObject {
  constructor(public readonly value: string) {}

  static create(description: string): DescriptionValueObject {
    if (description.length > 500) {
      throw new Error('Description cannot exceed 500 characters')
    }
    return new DescriptionValueObject(description)
  }
}
EOF

# ? ─── src/${NAME}/infrastructure ─────────────────────────────────────────

# * src/${NAME}/infrastructure/config/kafka.config.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/config/kafka.config.ts
export const kafkaCommonConfig = {
  client: {
    clientId: '${NAME}-service',
    // TODO: Cambiar por la URL de tu broker Kafka
    brokers: ['kafka1:9092']
  }
}
EOF

# * src/${NAME}/infrastructure/config/kafka.config.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/controllers/$NAME.grpc.controller.ts
/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Controller } from '@nestjs/common'

// TODO: Cambiar por tus propias importaciones de proto
import {
  ${CLASS_NAME}ServiceController,
  Get${CLASS_NAME}ByIdDto,
  Create${CLASS_NAME}Dto as ProtoCreate${CLASS_NAME}Dto,
  Update${CLASS_NAME}Dto as ProtoUpdate${CLASS_NAME}Dto,
  ${CLASS_NAME}ServiceControllerMethods,
  ${CLASS_NAME},
  ${CLASS_NAME}s
} from '@app/proto'

import { ${CLASS_NAME}ApplicationService } from '../../application/services/${NAME}-application.service'
import { ${CLASS_NAME}Mapper } from '../../application/mappers/${NAME}.mapper'

import { KafkaProducerService } from '../../infrastructure/messaging/kafka/kafka-producer.service'

@Controller()
@${CLASS_NAME}ServiceControllerMethods()
export class ${CLASS_NAME}GrpcController implements ${CLASS_NAME}ServiceController {
  constructor(
    private readonly applicationService: ${CLASS_NAME}ApplicationService,
    private readonly mapper: ${CLASS_NAME}Mapper,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  async create${CLASS_NAME}(protoDto: ProtoCreate${CLASS_NAME}Dto): Promise<${CLASS_NAME}> {
    try {
      const appDto = this.mapper.protoToCreateDto(protoDto)
      const entity = await this.applicationService.create(appDto)

      const proto = this.mapper.entityToProtoResponse(entity)

      // 👇 Emitir mensaje Kafka
      await this.kafkaProducer.emit${CLASS_NAME}Created(proto)

      return proto
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async getAll${CLASS_NAME}(): Promise<${CLASS_NAME}S> {
    try {
      const entities = await this.applicationService.findAll()
      return {
        ${CAMEL_CASE_NAME}s: entities.map((entity) =>
          this.mapper.entityToProtoResponse(entity)
        )
      }
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async get${CLASS_NAME}ById({ id }: Get${CLASS_NAME}ByIdDto): Promise<${CLASS_NAME}> {
    try {
      const entity = await this.applicationService.findOne(id)
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async delete${CLASS_NAME}({ id }: Get${CLASS_NAME}ByIdDto): Promise<void> {
    try {
      await this.applicationService.delete(id)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async update${CLASS_NAME}(protoDto: ProtoUpdate${CLASS_NAME}Dto): Promise<${CLASS_NAME}> {
    try {
      if (!protoDto.id) {
        throw new Error('ID is required for update')
      }

      const appDto = this.mapper.protoToUpdateDto(protoDto)

      const entity = await this.applicationService.update(protoDto.id, appDto)
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  private handleGrpcError(error: Error): never {
    throw new Error(\`GRPC Error: \${error.message}\`)
  }
}
EOF

# * src/${NAME}/infrastructure/interceptors/grpc-logging.interceptor.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/interceptors/grpc-logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GRPC')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerName = context.getHandler().name
    const className = context.getClass().name

    if (process.env.NODE_ENV !== 'development') {
      return next.handle()
    }

    this.logger.log(\`📥 Llamada entrante a \${className}.\${handlerName}\`)

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            \`✅ \${className}.\${handlerName}() completado en \${Date.now() - now}ms\`
            )
          )
        )
  }
}
EOF


# * src/${NAME}/infrastructure/modules/${NAME}.module.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/modules/$NAME.module.ts
import { Module } from '@nestjs/common'

import { ${CLASS_NAME}GrpcController } from '../controllers/${NAME}.grpc.controller'
import { ${CLASS_NAME}ApplicationService } from '../../application/services/${NAME}-application.service'
import { ${CLASS_NAME}Mapper } from '../../application/mappers/${NAME}.mapper'

// import { ${CLASS_NAME}Repository } from '../../domain/repositories/${NAME}.repository'
import { Prisma${CLASS_NAME}Repository } from '../persistence/prisma/${NAME}-prisma.repository.ts'
import { PrismaModule } from '../persistence/prisma/prisma.module'

import { KafkaModule } from '../messaging/kafka/kafka.module'

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [
    ${CLASS_NAME}ApplicationService,
    ${CLASS_NAME}Mapper,
    {
      provide: '${CLASS_NAME}Repository',
      useClass: Prisma${CLASS_NAME}Repository
    }
  ],
  controllers: [${CLASS_NAME}GrpcController]
})
export class ${CLASS_NAME}InfrastructureModule {}
EOF

# ? ─── src/${NAME}/infrastructure/messaging ───────────────────────────────────

# * src/${NAME}/infrastructure/messaging/kafka/consumers/${NAME}-created.consumer.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/messaging/kafka/consumers/$NAME-created.consumer.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

// TODO: Cambiar por tus propias importaciones de proto
import { ${CLASS_NAME} } from '@app/proto'

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect()
  }

  async emit${CLASS_NAME}Created(payload: ${CLASS_NAME}) {
    const message = {
      key: payload.id,
      value: JSON.stringify(payload)
    }

    const sizeInBytes = Buffer.byteLength(message.value, 'utf8')

    // * Debugging de tamaño del mensaje
    // console.log(\`📦 Tamaño del mensaje Kafka: \${sizeInBytes} bytes\`)

    // Validación
    if (sizeInBytes > 1024 * 1024) {
      throw new Error('❌ Payload demasiado grande para Kafka (> 1MB)')
    }

    // Enviar mensaje a Kafka
    await lastValueFrom(this.client.emit('${NAME}-created', message))
  }
}
EOF

# * src/${NAME}/infrastructure/messaging/kafka/kafka-producer.service.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/messaging/kafka/kafka-producer.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

// TODO: Cambiar por tus propias importaciones de proto
import { ${CLASS_NAME} } from '@app/proto'

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect()
  }

  async emit${CLASS_NAME}Created(payload: ${CLASS_NAME}) {
    const message = {
      key: payload.id,
      value: JSON.stringify(payload)
    }

    const sizeInBytes = Buffer.byteLength(message.value, 'utf8')

    // * Debugging de tamaño del mensaje
    // console.log(\`📦 Tamaño del mensaje Kafka: \${sizeInBytes} bytes\`)

    // Validación
    if (sizeInBytes > 1024 * 1024) {
      throw new Error('Payload demasiado grande para Kafka (> 1MB) 🚫')
    }

    // Enviar mensaje a Kafka
    await lastValueFrom(this.client.emit('${NAME}-created', message))
  }
}
EOF

# * src/${NAME}/infrastructure/messaging/kafka/kafka.module.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/messaging/kafka/kafka.module.ts
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaProducerService } from './kafka-producer.service'
import { ${CLASS_NAME}CreatedConsumer } from './consumers/${NAME}-created.consumer'

import { kafkaCommonConfig } from '../../config/kafka.config'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          ...kafkaCommonConfig,
          consumer: {
            groupId: 'unused-producer-only'
          }
        }
      }
    ])
  ],
  controllers: [${CLASS_NAME}CreatedConsumer],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService]
})
export class KafkaModule {}
EOF

# ? ─── src/${NAME}/infrastructure/persistencee ─────────────────────────────────

# * src/${NAME}/infrastructure/persistence/prisma/$NAME-prisma.repository.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/persistence/prisma/$NAME-prisma.repository.ts
/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ${CLASS_NAME}Entity } from '../../../domain/entities/${NAME}.entity'
import { ${CLASS_NAME}Repository } from '../../../domain/repositories/${NAME}.repository'

@Injectable()
export class Prisma${CLASS_NAME}Repository implements ${CLASS_NAME}Repository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: ${CLASS_NAME}Entity): Promise<${CLASS_NAME}Entity> {
    const saved = await this.prisma.${CAMEL_CASE_NAME}.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        name: entity.name,
        description: entity.description.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: {
        name: entity.name,
        description: entity.description.value,
        updatedAt: new Date()
      }
    })

    return ${CLASS_NAME}Entity.reconstruct({
      id: saved.id,
      name: saved.name,
      description: saved.description ?? '',
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    })
  }

  async findById(id: string): Promise<${CLASS_NAME}Entity | null> {
    const result = await this.prisma.${CAMEL_CASE_NAME}.findUnique({ where: { id } })

    if (!result) return null

    return ${CLASS_NAME}Entity.reconstruct({
      id: result.id,
      name: result.name,
      description: result.description ?? '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    })
  }

  async findAll(): Promise<${CLASS_NAME}Entity[]> {
    const results = await this.prisma.${NAME}.findMany()

    return results.map((result) =>
      ${CLASS_NAME}Entity.reconstruct({
        id: result.id,
        name: result.name,
        description: result.description ?? '',
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      })
    )
  }
  async update(id: string, entity: ${CLASS_NAME}Entity): Promise<${CLASS_NAME}Entity> {
    const updated = await this.prisma.${NAME}.update({
      where: { id },
      data: {
        name: entity.name,
        description: entity.description.value,
        updatedAt: new Date()
      }
    })

    return ${CLASS_NAME}Entity.reconstruct({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? '',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.${NAME}.delete({ where: { id } })
  }
}
EOF


# * src/${NAME}/infrastructure/persistence/prisma/prisma.module.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/persistence/prisma/prisma.module.ts
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
EOF


# * src/${NAME}/infrastructure/persistence/prisma/prisma.service.ts
cat <<EOF > $DEST/src/$NAME/infrastructure/persistence/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.\$connect()
  }

  async onModuleDestroy() {
    await this.\$disconnect()
  }
}
EOF

echo "✅ Microservicio '$NAME' generado con estructura y contenido base."


# # * src/${NAME}/infrastructure/persistance/prisma/$NAME-prisma.repository.ts
# cat <<EOF > $DEST/src/$NAME/infrastructure/persistance/prisma/$NAME-prisma.repository.ts

# EOF

# Generar archivos de proto

bash ./init-proto.sh $NAME $CLASS_NAME $INSTANCE_NAME $CAMEL_CASE_NAME 
