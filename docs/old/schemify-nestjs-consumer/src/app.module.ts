import { Module } from '@nestjs/common'
import { ExampleModule } from './example/example.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ExampleModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
