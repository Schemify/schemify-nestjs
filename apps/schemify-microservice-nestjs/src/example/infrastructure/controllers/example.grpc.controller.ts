/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */

import { Controller } from '@nestjs/common'
import {
  ExampleServiceController,
  GetExampleByIdDto,
  CreateExampleDto as ProtoCreateExampleDto,
  UpdateExampleDto as ProtoUpdateExampleDto,
  ExampleServiceControllerMethods,
  Example,
  Examples
} from '@app/proto'
import { ExampleApplicationService } from '../../application/services/example-application.service'
import { ExampleMapper } from '../../application/mappers/example.mapper'

import { KafkaProducerService } from '../../infrastructure/messaging/kafka/kafka-producer.service'

@Controller()
@ExampleServiceControllerMethods()
export class ExampleGrpcController implements ExampleServiceController {
  constructor(
    private readonly applicationService: ExampleApplicationService,
    private readonly mapper: ExampleMapper,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  async createExample(protoDto: ProtoCreateExampleDto): Promise<Example> {
    try {
      const appDto = this.mapper.protoToCreateDto(protoDto)
      const entity = await this.applicationService.create(appDto)

      const proto = this.mapper.entityToProtoResponse(entity)

      // 👇 Emitir mensaje Kafka
      await this.kafkaProducer.emitExampleCreated(proto)

      return proto
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async getAllExamples(): Promise<Examples> {
    try {
      const entities = await this.applicationService.findAll()
      return {
        examples: entities.map((entity) =>
          this.mapper.entityToProtoResponse(entity)
        )
      }
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async getExampleById({ id }: GetExampleByIdDto): Promise<Example> {
    try {
      const entity = await this.applicationService.findOne(id)
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async deleteExample({ id }: GetExampleByIdDto): Promise<void> {
    try {
      await this.applicationService.delete(id)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  async updateExample(protoDto: ProtoUpdateExampleDto): Promise<Example> {
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
