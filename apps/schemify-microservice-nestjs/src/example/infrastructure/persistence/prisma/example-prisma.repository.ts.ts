/* eslint-disable @darraghor/nestjs-typed/injectable-should-be-provided */

import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { ExampleEntity } from '../../../domain/entities/example.entity'
import { ExampleRepository } from '../../../domain/repositories/example.repository'

@Injectable()
export class PrismaExampleRepository implements ExampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(entity: ExampleEntity): Promise<ExampleEntity> {
    const saved = await this.prisma.example.upsert({
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

    return ExampleEntity.reconstruct({
      id: saved.id,
      name: saved.name,
      description: saved.description ?? '',
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt
    })
  }

  async findById(id: string): Promise<ExampleEntity | null> {
    const result = await this.prisma.example.findUnique({ where: { id } })

    if (!result) return null

    return ExampleEntity.reconstruct({
      id: result.id,
      name: result.name,
      description: result.description ?? '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    })
  }

  async findAll(): Promise<ExampleEntity[]> {
    const results = await this.prisma.example.findMany()

    return results.map((result) =>
      ExampleEntity.reconstruct({
        id: result.id,
        name: result.name,
        description: result.description ?? '',
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      })
    )
  }
  async update(id: string, entity: ExampleEntity): Promise<ExampleEntity> {
    const updated = await this.prisma.example.update({
      where: { id },
      data: {
        name: entity.name,
        description: entity.description.value,
        updatedAt: new Date()
      }
    })

    return ExampleEntity.reconstruct({
      id: updated.id,
      name: updated.name,
      description: updated.description ?? '',
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.example.delete({ where: { id } })
  }
}
