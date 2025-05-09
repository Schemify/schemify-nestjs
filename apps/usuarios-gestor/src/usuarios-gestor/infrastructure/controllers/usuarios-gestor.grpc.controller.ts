/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */
import { Controller } from '@nestjs/common'

// TODO: Cambiar por tus propias importaciones de proto
import {
  UsuariosGestorServiceController,
  GetUsuariosGestorByIdDto,
  CreateUsuariosGestorDto as ProtoCreateUsuariosGestorDto,
  UpdateUsuariosGestorDto as ProtoUpdateUsuariosGestorDto,
  UsuariosGestorServiceControllerMethods,
  UsuariosGestor,
  UsuariosGestors
} from '@app/proto'

import { UsuariosGestorApplicationService } from '../../application/services/usuarios-gestor-application.service'
import { UsuariosGestorMapper } from '../../application/mappers/usuarios-gestor.mapper'

import { KafkaProducerService } from '../../infrastructure/messaging/kafka/kafka-producer.service'

@Controller()
@UsuariosGestorServiceControllerMethods()
export class UsuariosGestorGrpcController
  implements UsuariosGestorServiceController
{
  constructor(
    private readonly applicationService: UsuariosGestorApplicationService,
    private readonly mapper: UsuariosGestorMapper,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  async createUsuariosGestor(
    protoDto: ProtoCreateUsuariosGestorDto
  ): Promise<UsuariosGestor> {
    try {
      const appDto = this.mapper.protoToCreateDto(protoDto)
      const entity = await this.applicationService.create(appDto)

      const proto = this.mapper.entityToProtoResponse(entity)

      // 👇 Emitir mensaje Kafka
      await this.kafkaProducer.emitUsuariosGestorCreated(proto)

      return proto
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async getAllUsuariosGestor(): Promise<UsuariosGestorS> {
    try {
      const entities = await this.applicationService.findAll()
      return {
        usuariosgestors: entities.map((entity) =>
          this.mapper.entityToProtoResponse(entity)
        )
      }
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async getUsuariosGestorById({
    id
  }: GetUsuariosGestorByIdDto): Promise<UsuariosGestor> {
    try {
      const entity = await this.applicationService.findOne(id)
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async deleteUsuariosGestor({ id }: GetUsuariosGestorByIdDto): Promise<void> {
    try {
      await this.applicationService.delete(id)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async updateUsuariosGestor(
    protoDto: ProtoUpdateUsuariosGestorDto
  ): Promise<UsuariosGestor> {
    try {
      if (!protoDto.id) {
        throw new Error('ID is required for update')
      }

      const appDto = this.mapper.protoToUpdateDto(protoDto)

      const entity = await this.applicationService.update(protoDto.id, appDto)
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  private handleGrpcError(error: Error): never {
    throw new Error(`GRPC Error: ${error.message}`)
  }
}
