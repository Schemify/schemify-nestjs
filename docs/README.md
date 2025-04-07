src/
├── domain/                     # Capa de Dominio
│   ├── entities/               # Entidades del dominio
│   │   └── user.entity.ts      # Ejemplo: Entidad User
│   ├── repositories/           # Interfaces de repositorios
│   │   └── user.repository.ts  # Contrato para el repositorio de User
│   ├── services/               # Servicios de dominio
│   │   └── user.service.ts     # Lógica de negocio pura para User
│   ├── value-objects/          # Objetos de valor
│   │   └── email.value-object.ts
│   └── events/                 # Eventos de dominio
│       └── user-created.event.ts
│
├── application/                # Capa de Aplicación
│   ├── use-cases/              # Casos de uso
│   │   └── create-user.use-case.ts
│   ├── dtos/                   # DTOs para la comunicación
│   │   └── create-user.dto.ts
│   ├── mappers/                # Mapeadores entre capas
│   │   └── user.mapper.ts
│   └── services/               # Servicios de aplicación
│       └── user-application.service.ts
│
├── infrastructure/             # Capa de Infraestructura
│   ├── database/               # Configuración de la base de datos
│   │   └── user.repository.ts  # Implementación del repositorio
│   ├── controllers/            # Controladores HTTP
│   │   └── user.controller.ts
│   ├── providers/              # Proveedores de servicios
│   │   └── user.provider.ts
│   ├── config/                 # Configuración de la aplicación
│   │   └── database.config.ts
│   ├── exceptions/             # Manejo de excepciones
│   │   └── user.exception.ts
│   └── modules/                # Módulos de infraestructura
│       └── user.module.ts
│
├── shared/                     # Componentes compartidos
│   ├── decorators/             # Decoradores personalizados
│   │   └── roles.decorator.ts
│   ├── guards/                 # Guards personalizados
│   │   └── auth.guard.ts
│   ├── interceptors/           # Interceptors personalizados
│   │   └── logging.interceptor.ts
│   ├── pipes/                  # Pipes personalizados
│   │   └── validation.pipe.ts
│   └── utils/                  # Utilidades generales
│       └── helpers.ts
│
└── app.module.ts               # Módulo principal de la aplicación