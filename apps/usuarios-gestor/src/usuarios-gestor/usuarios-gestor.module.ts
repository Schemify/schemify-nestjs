import { Module } from '@nestjs/common'

import { UsuariosGestorInfrastructureModule } from './infrastructure/modules/usuarios-gestor.module'
import { UsuariosGestorApplicationService } from './application/services/usuarios-gestor-application.service'

@Module({
  imports: [UsuariosGestorInfrastructureModule],
  controllers: [],
  providers: [UsuariosGestorApplicationService],
  exports: []
})
export class UsuariosGestorModule {}
