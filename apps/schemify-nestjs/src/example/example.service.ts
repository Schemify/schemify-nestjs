import {
  Injectable,
  NotFoundException,
  OnModuleInit,
  Inject
} from '@nestjs/common'
// import { CreateExampleDto } from './dto/create-example.dto'
// import { UpdateExampleDto } from './dto/update-example.dto'

import {
  Example,
  CreateExampleDto,
  UpdateExampleDto,
  PaginationDto,
  Examples
} from '@app/common'
import { randomUUID } from 'crypto'
import { Observable, Subject } from 'rxjs'
import { ClientKafkaProxy } from '@nestjs/microservices'

@Injectable()
export class ExampleService implements OnModuleInit {
  constructor(
    @Inject('EXAMPLE_KAFKA_CLIENT') private kafkaClient: ClientKafkaProxy
  ) {}

  private readonly examples: Example[] = []

  // * Probar agreando nuevos ejemplos
  onModuleInit() {
    for (let i = 0; i < 100; i++) {
      const example: Example = {
        id: randomUUID(),
        name: `Example ${i}`,
        description: `Description ${i}`
      }

      this.examples.push(example)
    }

    // Suscribimos a los eventos de Kafka
    this.kafkaClient.subscribeToResponseOf('example.time')
  }

  createExample(createExampleDto: CreateExampleDto): Example {
    const example: Example = {
      ...createExampleDto,
      id: randomUUID()
    }

    this.examples.push(example)

    // Mesage to Kafka: value, key, headers
    // Cuando necesitemos hacer atomicidad, debemos asegurarnos de utilizar el mismo partition
    // Para garantizar esto simplemnte debemos especificar la key
    this.kafkaClient.emit('example.created', { key: example.id }) // request-reply

    return example
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getExampleTime() {
    // Utilizamos send para hacer un request-reply
    return this.kafkaClient.send('example.time', { id: 1 })
  }

  getAllExamples() {
    return { examples: this.examples }
  }

  getExampleById(id: string): Example {
    const example = this.examples.find((example) => example.id === id)
    if (!example) {
      throw new Error(`Example with id ${id} not found`)
    }
    return example
  }

  updateExample(id: string, updateExampleDto: UpdateExampleDto) {
    const exampleIndex = this.examples.findIndex((example) => example.id === id)

    if (exampleIndex === -1) {
      throw new NotFoundException(`Example with id ${id} not found`)
    }

    const updatedExample: Example = {
      ...this.examples[exampleIndex],
      ...updateExampleDto
    }
    this.examples[exampleIndex] = updatedExample
    return updatedExample
  }

  deleteExample(id: string): Example {
    const exampleIndex = this.examples.findIndex((example) => example.id === id)

    if (exampleIndex === -1) {
      throw new NotFoundException(`Example with id ${id} not found`)
    }

    return this.examples.splice(exampleIndex)[0]
  }

  queryExamples(
    paginationDtoStream: Observable<PaginationDto>
  ): Observable<Examples> {
    const subject = new Subject<Examples>()

    const onNext = (paginationDto: PaginationDto) => {
      const start = paginationDto.page * paginationDto.skip
      subject.next({
        examples: this.examples.slice(start, start + paginationDto.skip)
      })
    }

    const onComplete = () => {
      subject.complete()
    }

    paginationDtoStream.subscribe({
      next: onNext,
      complete: onComplete
    })

    return subject.asObservable()
  }
}
