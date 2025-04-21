import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

/**
 * Configuración de Swagger para la aplicación.
 * @param {INestApplication} app - Instancia de la aplicación NestJS.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Schemify NestJS API')
    .setDescription('API Microservicio de Schemify NestJS')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
