import { UsuariosGestorEntity } from '../../domain/entities/usuarios-gestor.entity'

import { CreateUsuariosGestorDto } from '../dtos/create-usuarios-gestor.dto'
import { UpdateUsuariosGestorDto } from '../dtos/update-usuarios-gestor.dto'

// TODO: Cambiar por tus propias importaciones de proto
import {
  CreateUsuariosGestorDto as ProtoCreateUsuariosGestorDto,
  UpdateUsuariosGestorDto as ProtoUpdateUsuariosGestorDto,
  UsuariosGestor as ProtoUsuariosGestor
} from 'libs/proto/generated'

export class UsuariosGestorMapper {
  protoToCreateDto(
    protoDto: ProtoCreateUsuariosGestorDto
  ): CreateUsuariosGestorDto {
    return {
      name: protoDto.name,
      description: protoDto.description
      // Mapear otros campos según sea necesario
    }
  }

  protoToUpdateDto(
    protoDto: ProtoUpdateUsuariosGestorDto
  ): UpdateUsuariosGestorDto {
    return {
      name: protoDto.usuariosgestor?.name || undefined,
      description: protoDto.usuariosgestor?.description || undefined
    }
  }

  entityToProtoResponse(entity: UsuariosGestorEntity): ProtoUsuariosGestor {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description.value
      // createdAt: entity.createdAt.toISOString(),
      // updatedAt: entity.updatedAt?.toISOString() || ''
    }
  }
}
