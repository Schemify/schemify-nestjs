import { Module } from '@nestjs/common'

import { UsuariosGestorGrpcController } from '../controllers/usuarios-gestor.grpc.controller'
import { UsuariosGestorApplicationService } from '../../application/services/usuarios-gestor-application.service'
import { UsuariosGestorMapper } from '../../application/mappers/usuarios-gestor.mapper'

// import { UsuariosGestorRepository } from '../../domain/repositories/usuarios-gestor.repository'
import { PrismaUsuariosGestorRepository } from '../persistence/prisma/usuarios-gestor-prisma.repository.ts'
import { PrismaModule } from '../persistence/prisma/prisma.module'

import { KafkaModule } from '../messaging/kafka/kafka.module'

@Module({
  imports: [PrismaModule, KafkaModule],
  providers: [
    UsuariosGestorApplicationService,
    UsuariosGestorMapper,
    {
      provide: 'UsuariosGestorRepository',
      useClass: PrismaUsuariosGestorRepository
    }
  ],
  controllers: [UsuariosGestorGrpcController]
})
export class UsuariosGestorInfrastructureModule {}
