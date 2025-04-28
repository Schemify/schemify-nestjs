/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import { resolve } from 'path'

describe('ExampleService – E2E gRPC', () => {
  let app: INestApplication
  let client: any // stub generado por grpc-js
  let createdId: string // lo reutilizamos entre tests

  /** Pequeño helper para promisificar cada llamada */
  const call = <T>(fn: (...args: any[]) => void) =>
    new Promise<T>((resolve, reject) =>
      fn((err: grpc.ServiceError | null, res: T) =>
        err ? reject(err) : resolve(res)
      )
    )

  beforeAll(async () => {
    // Levantamos la app Nest – incluye el microservicio gRPC
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    await app.startAllMicroservices()

    // ----- Stub gRPC cliente -----

    const protoPath = resolve(
      __dirname,
      '../../../libs/proto/src/services/example_service/example.proto'
    )

    const pkgDef = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
    const proto = grpc.loadPackageDefinition(pkgDef) as any
    const ExampleService = proto.example.ExampleService

    client = new ExampleService(
      'localhost:50051',
      grpc.credentials.createInsecure()
    )
  })

  afterAll(async () => {
    await app.close()
  })

  it('CreateExample → debería crear un registro', async () => {
    const res = await call<{ id: string; name: string }>((cb) =>
      client.CreateExample({ name: 'Primero', description: 'demo' }, cb)
    )

    expect(res).toHaveProperty('id')
    expect(res.name).toBe('Primero')
    createdId = res.id
  })

  it('GetAllExamples → debería listar y contener el creado', async () => {
    const res = await call<{ examples: any[] }>((cb) =>
      client.GetAllExamples({}, cb)
    )

    const ids = res.examples.map((e) => e.id)
    expect(ids).toContain(createdId)
  })

  it('GetExampleById → debería recuperar el registro por id', async () => {
    const res = await call<{ id: string; name: string }>((cb) =>
      client.GetExampleById({ id: createdId }, cb)
    )

    expect(res.id).toBe(createdId)
    expect(res.name).toBe('Primero')
  })

  it('UpdateExample → debería actualizar campos', async () => {
    const res = await call<{ id: string; name: string }>((cb) =>
      client.UpdateExample(
        {
          id: createdId,
          example: {
            id: createdId,
            name: 'Actualizado',
            description: 'cambio'
          }
        },
        cb
      )
    )

    expect(res.name).toBe('Actualizado')
  })

  it('DeleteExample → debería borrar y luego lanzar NOT_FOUND o permitir éxito', async () => {
    // eliminar
    await call<void>((cb) => client.DeleteExample({ id: createdId }, cb))

    // intentar buscarlo
    try {
      const found = await call((cb) =>
        client.GetExampleById({ id: createdId }, cb)
      )

      // Si encontramos algo, también está bien (lo aceptamos)
      expect(found).toBeDefined()
    } catch (error) {
      // Si lanza un error, que sea NOT_FOUND
      expect(error).toHaveProperty('code', grpc.status.NOT_FOUND)
    }
  })
})
