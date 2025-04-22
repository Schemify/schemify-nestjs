/* eslint-disable @darraghor/nestjs-typed/controllers-should-supply-api-tags */

import { Controller } from '@nestjs/common'
// import { Observable } from 'rxjs'
import {
  ExampleServiceController,
  GetExampleByIdDto,
  CreateExampleDto as ProtoCreateExampleDto,
  UpdateExampleDto as ProtoUpdateExampleDto,
  ExampleServiceControllerMethods,
  Example,
  Examples
} from 'libs/proto/generated'
import { ExampleApplicationService } from '../../application/services/example-application.service'
import { ExampleMapper } from '../../application/mappers/example.mapper'

// import { CreateExampleDto } from '../../application/dtos/create-example.dto'
// import { UpdateExampleDto } from '../../application/dtos/update-example.dto'

@Controller()
@ExampleServiceControllerMethods()
export class ExampleGrpcController implements ExampleServiceController {
  constructor(
    private readonly applicationService: ExampleApplicationService,
    private readonly mapper: ExampleMapper
  ) {}

  async createExample(protoDto: ProtoCreateExampleDto): Promise<Example> {
    try {
      const appDto = this.mapper.protoToCreateDto(protoDto)
      const entity = await this.applicationService.create(appDto)
      return this.mapper.entityToProtoResponse(entity)
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
      if (!protoDto.example?.id) {
        throw new Error('ID is required for update')
      }

      const appDto = this.mapper.protoToUpdateDto(protoDto)

      const entity = await this.applicationService.update(
        protoDto.example.id,
        appDto
      )
      return this.mapper.entityToProtoResponse(entity)
    } catch (error) {
      this.handleGrpcError(error)
    }
  }

  // queryExamples(
  //   paginationDtoStream: Observable<PaginationDto>
  // ): Observable<Examples> {
  //   // Implementación para streaming
  //   return new Observable((subscriber) => {
  //     paginationDtoStream.subscribe({
  //       next: async (paginationDto) => {
  //         try {
  //           const entities =
  //             await this.applicationService.paginate(paginationDto)
  //           subscriber.next({
  //             examples: entities.map((entity) =>
  //               this.mapper.entityToProtoResponse(entity)
  //             )
  //           })
  //         } catch (error) {
  //           subscriber.error(this.handleGrpcError(error))
  //         }
  //       },
  //       complete: () => subscriber.complete(),
  //       error: (error) => subscriber.error(error)
  //     })
  //   })
  // }

  private handleGrpcError(error: Error): never {
    // Implementación de manejo de errores gRPC
    throw new Error(`GRPC Error: ${error.message}`)
    // En producción usaría RpcException y códigos de estado apropiados
  }
}
