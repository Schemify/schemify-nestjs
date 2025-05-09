import { Module } from '@nestjs/common'

import { UsuariosGestorModule } from './usuarios-gestor/usuarios-gestor.module'

@Module({
  imports: [UsuariosGestorModule],
  controllers: [],
  providers: []
})
export class AppModule {}
