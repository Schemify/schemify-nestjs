import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUsuariosGestorDto } from '../dtos/create-usuarios-gestor.dto'
import { UsuariosGestorEntity } from '../../domain/entities/usuarios-gestor.entity'
import { UsuariosGestorRepository } from '../../domain/repositories/usuarios-gestor.repository'

@Injectable()
export class UsuariosGestorApplicationService {
  constructor(
    @Inject('UsuariosGestorRepository')
    private readonly repository: UsuariosGestorRepository
  ) {}

  async create(dto: CreateUsuariosGestorDto): Promise<UsuariosGestorEntity> {
    const usuariosgestor = UsuariosGestorEntity.create(dto)
    return this.repository.save(usuariosgestor)
  }

  async findOne(id: string): Promise<UsuariosGestorEntity> {
    const entity = await this.repository.findById(id)

    if (!entity) {
      throw new NotFoundException(`UsuariosGestor with id ${id} not found`)
    }

    return entity
  }

  async findAll(): Promise<UsuariosGestorEntity[]> {
    return this.repository.findAll()
  }

  async update(
    id: string,
    dto: Partial<CreateUsuariosGestorDto>
  ): Promise<UsuariosGestorEntity> {
    const entity = await this.findOne(id)
    entity.update(dto)
    return this.repository.save(entity)
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findOne(id)

    try {
      if (!entity) {
        throw new NotFoundException(`UsuariosGestor with id ${id} not found`)
      }
      await this.repository.delete(id)
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      throw new Error(
        `Error deleting usuarios-gestor with id ${id}: ${error.message}`
      )
    }
  }
}
