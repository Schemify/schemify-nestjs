/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { join } from 'path'

import { EXAMPLE_PACKAGE_NAME } from '@app/proto'

describe('ExampleService (gRPC)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'EXAMPLE_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: EXAMPLE_PACKAGE_NAME,
              protoPath: join(
                __dirname,
                '../../../libs/proto/src/services/example_service/example.proto'
              ),
              url: 'localhost:50051'
            }
          }
        ])
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  type Example = { id: string; name: string }
  type ExamplesResponse = { examples: Example[] }

  it('debería devolver un array (vacío o con datos)', async () => {
    const grpcClient = app.get('EXAMPLE_PACKAGE')
    const client = grpcClient.getService('ExampleService')

    const response: ExamplesResponse = await new Promise((resolve, reject) => {
      client.GetAllExamples(null, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    })

    expect(response).toHaveProperty('examples')
    expect(Array.isArray(response.examples)).toBe(true)

    // 🔁 Si hay elementos, validamos que tengan las propiedades necesarias
    for (const example of response.examples) {
      expect(example).toHaveProperty('id')
      expect(example).toHaveProperty('name')
    }
  })
})
