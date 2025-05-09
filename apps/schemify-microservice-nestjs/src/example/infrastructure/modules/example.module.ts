import { Module } from '@nestjs/common'

import { ExampleGrpcController } from '../controllers/example.grpc.controller'
import { ExampleApplicationService } from '../../application/services/example-application.service'
import { ExampleMapper } from '../../application/mappers/example.mapper'

// import { ExampleRepository } from '../../domain/repositories/example.repository'
import { PrismaExampleRepository } from '../persistence/prisma/example-prisma.repository'
import { PrismaModule } from '../persistence/prisma/prisma.module'

import { KafkaModule } from '../messaging/kafka/kafka.module'

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [
    ExampleApplicationService,
    ExampleMapper,
    {
      provide: 'ExampleRepository',
      useClass: PrismaExampleRepository
    }
  ],
  controllers: [ExampleGrpcController]
})
export class ExampleInfrastructureModule {}
