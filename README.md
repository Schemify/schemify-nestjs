<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://schemify.github.io/schemify.com/assets/img/logos/schemify-logo.svg" width="120" alt="Nest Logo" /></a>
</p>


<p align="center">
  <!-- Estado general -->
  <img src="https://img.shields.io/badge/Status-Development-orange" alt="Estado del proyecto: En desarrollo" />

  <!-- Tecnologías principales -->
  <img src="https://img.shields.io/badge/NestJS-%5E10.x-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Kafka-Bitnami-black?logo=apachekafka" alt="Kafka Bitnami" />
  <img src="https://img.shields.io/badge/gRPC-Active-6f42c1?logo=grpc" alt="gRPC" />
  <img src="https://img.shields.io/badge/Prisma-%5E6.x-2D3748?logo=prisma" alt="Prisma ORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-%5E15.x-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker" alt="Docker Ready" />

  <!-- Arquitectura -->
  <img src="https://img.shields.io/badge/Domain--Driven%20Design-Aplicado-0d1117" alt="Domain-Driven Design aplicado" />
  <img src="https://img.shields.io/badge/Ports%20%26%20Adapters-Architecture-lightgrey" alt="Arquitectura de Puertos y Adaptadores" />
</p>




## 📄 Descripción
Este microservicio forma parte del ecosistema de <strong>Schemify</strong>. Fue desarrollado con:

- NestJS como framework base.
- Arquitectura Hexagonal y Domain-Driven Design (DDD).
- Comunicación sincrónica vía gRPC.
- Comunicación asíncrona vía Apache Kafka (Bitnami).
- Prisma ORM y PostgreSQL como capa de persistencia.
- Pruebas end-to-end usando Jest.

---

## ⚙️ Instalación del Proyecto

```bash
$ npm install
```

---

## ⚡ Compilación y Ejecución

```bash
# Desarrollo
$ npm run start:dev

# Producción
$ npm run start:prod
```

---

## 🌍 Docker

Este microservicio está listo para ejecutarse en contenedores. Puedes usar `docker-compose` para levantar los servicios:

```bash
$ docker compose up --build
```

Asegúrate de configurar la red externa `schemify-kafka-net` si usas otros servicios conectados por Kafka.

---

## 🔧 Pruebas

```bash
# Unitarias
$ npm run test

# End-to-End
$ npm run test:e2e
```

---

## 🚧 Tecnologías Clave

- **gRPC**: contratos definidos en `.proto`, compilados con `ts-proto`, y expuestos como servicios NestJS.
- **Kafka**: Producers y Consumers implementados como servicios inyectables. Soporte para múltiples topics y grupos.
- **DDD / Hexagonal**:
  - `application/`: DTOs, mappers, servicios y casos de uso.
  - `domain/`: entidades, value objects, interfaces de repositorios.
  - `infrastructure/`: controladores gRPC/Kafka, adapters de persistencia, módulos.

---

## 🔍 Exploración de mensajes Kafka
Puedes monitorear el flujo de mensajes en tiempo real usando:

- Kafka UI (`http://localhost:8081`)
- Comando CLI:
  ```bash
  docker exec -it kafka1 kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic example-created --from-beginning
  ```

---

## 👥 Autor y Contacto

**Alejandro Díaz**  
Estudiante de Ingeniería Civil Informática, Universidad de Valparaíso  

- GitHub: [IxyzDev](https://github.com/IxyzDev)
- LinkedIn: [in/ixyzdev](https://www.linkedin.com/in/ixyzdev/)

---

## 🔒 Licencia

Este proyecto está licenciado bajo la licencia MIT.

---

<p align="center">
  <em>Schemify Microservice</em> - Diseñado para ser simple, robusto y escalable. ✨
</p>




<!-- 
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE). -->
