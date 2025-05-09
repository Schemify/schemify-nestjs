/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { UsuariosGestorEntity } from '../../../domain/entities/usuarios-gestor.entity'
import { UsuariosGestorRepository } from '../../../domain/repositories/usuarios-gestor.repository'

@Injectable()
export class PrismaUsuariosGestorRepository
  implements UsuariosGestorRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: UsuariosGestorEntity): Promise<UsuariosGestorEntity> {
    const saved = await this.prisma.usuariosgestor.upsert({
      where: { id: entity.id },
      create: {
        id: entity.id,
        name: entity.name,
        description: entity.description.value,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
      },
      update: {
        name: entity.name,
        description: entity.description.value,
        updatedAt: new Date()
      }
    })

    return UsuariosGestorEntity.reconstruct({
      id: saved.id,
      name: saved.name,
      description: saved.description ?? '',
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    })
  }

  async findById(id: string): Promise<UsuariosGestorEntity | null> {
    const result = await this.prisma.usuariosgestor.findUnique({
      where: { id }
    })

    if (!result) return null

    return UsuariosGestorEntity.reconstruct({
      id: result.id,
      name: result.name,
      description: result.description ?? '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    })
  }

  async findAll(): Promise<UsuariosGestorEntity[]> {
    const results = (await this.prisma.usuarios) - gestor.findMany()

    return results.map((result) =>
      UsuariosGestorEntity.reconstruct({
        id: result.id,
        name: result.name,
        description: result.description ?? '',
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      })
    )
  }
  async update(
    id: string,
    entity: UsuariosGestorEntity
  ): Promise<UsuariosGestorEntity> {
    const updated =
      (await this.prisma.usuarios) -
      gestor.update({
        where: { id },
        data: {
          name: entity.name,
          description: entity.description.value,
          updatedAt: new Date()
        }
      })

    return UsuariosGestorEntity.reconstruct({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? '',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    })
  }

  async delete(id: string): Promise<void> {
    ;(await this.prisma.usuarios) - gestor.delete({ where: { id } })
  }
}
