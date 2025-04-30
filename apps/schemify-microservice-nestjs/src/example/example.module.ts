import { Module } from '@nestjs/common'

import { ExampleInfrastructureModule } from './infrastructure/modules/example.module'
// import { ExampleApplicationService } from './application/services/example-application.service'

@Module({
  imports: [ExampleInfrastructureModule],
  controllers: [],
  // providers: [ExampleApplicationService],
  exports: []
})
export class ExampleModule {}
