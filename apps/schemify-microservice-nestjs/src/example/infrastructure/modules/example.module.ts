import { Module } from '@nestjs/common'

import { ExampleGrpcController } from '../controllers/example.grpc.controller'
import { ExampleApplicationService } from '../../application/services/example-application.service'
import { ExampleMapper } from '../../application/mappers/example.mapper'

@Module({
  providers: [ExampleApplicationService, ExampleMapper],
  controllers: [ExampleGrpcController]
})
export class ExampleInfrastructureModule {}
