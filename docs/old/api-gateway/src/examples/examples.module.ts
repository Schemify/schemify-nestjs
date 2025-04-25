import { Module } from '@nestjs/common'
import { ExamplesService } from './examples.service'
import { ExamplesController } from './examples.controller'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EXAMPLE_SERVICE } from './constants'
import { EXAMPLE_PACKAGE_NAME } from '@app/common'
import { join } from 'path'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: EXAMPLE_SERVICE,
        transport: Transport.GRPC,
        options: {
          package: EXAMPLE_PACKAGE_NAME,
          protoPath: join(__dirname, '../example.proto')
        }
      }
    ])
  ],
  controllers: [ExamplesController],
  providers: [ExamplesService]
})
export class ExamplesModule {}
