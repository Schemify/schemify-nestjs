import { Module } from '@nestjs/common'

import { ExampleInfrastructureModule } from './infrastructure/modules/example.module'

@Module({
  imports: [ExampleInfrastructureModule],
  controllers: [],
  providers: []
})
export class ExampleModule {}
