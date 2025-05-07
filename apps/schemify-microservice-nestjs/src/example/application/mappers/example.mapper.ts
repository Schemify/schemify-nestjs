// src/example/application/mappers/example.mapper.ts

import { ExampleEntity } from '../../domain/entities/example.entity'

import { CreateExampleDto } from '../dtos/create-example.dto'
import { UpdateExampleDto } from '../dtos/update-example.dto'

import {
  CreateExampleDto as ProtoCreateExampleDto,
  UpdateExampleDto as ProtoUpdateExampleDto,
  Example as ProtoExample
} from '@app/proto'

export class ExampleMapper {
  protoToCreateDto(protoDto: ProtoCreateExampleDto): CreateExampleDto {
    return {
      name: protoDto.name,
      description: protoDto.description
      // Mapear otros campos según sea necesario
    }
  }

  protoToUpdateDto(protoDto: ProtoUpdateExampleDto): UpdateExampleDto {
    return {
      name: protoDto.example?.name || undefined,
      description: protoDto.example?.description || undefined
    }
  }

  entityToProtoResponse(entity: ExampleEntity): ProtoExample {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description.value
      // createdAt: entity.createdAt.toISOString(),
      // updatedAt: entity.updatedAt?.toISOString() || ''
    }
  }
}
