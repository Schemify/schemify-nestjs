import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Global() // Hace que PrismaService esté disponible globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
