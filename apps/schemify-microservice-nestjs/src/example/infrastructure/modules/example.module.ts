import { Module } from '@nestjs/common'

import { ExampleGrpcController } from '../controllers/example.grpc.controller'
import { ExampleApplicationService } from '../../application/services/example-application.service'
import { ExampleMapper } from '../../application/mappers/example.mapper'

// import { ExampleRepository } from '../../domain/repositories/example.repository'
import { PrismaExampleRepository } from '../persistence/prisma/example-prisma.repository.ts'
import { PrismaModule } from '../persistence/prisma/prisma.module'

@Module({
  imports: [PrismaModule],
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
