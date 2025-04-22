import { Module } from '@nestjs/common'
import { ExampleModule } from './example/example.module'

import { SharedConfigModule } from 'libs/config/config.module'

@Module({
  imports: [SharedConfigModule, ExampleModule],
  controllers: [],
  providers: []
})
export class AppModule {}
