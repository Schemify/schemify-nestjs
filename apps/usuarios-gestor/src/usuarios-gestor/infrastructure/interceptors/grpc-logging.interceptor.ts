import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GRPC')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerName = context.getHandler().name
    const className = context.getClass().name

    if (process.env.NODE_ENV !== 'development') {
      return next.handle()
    }

    this.logger.log(`📥 Llamada entrante a ${className}.${handlerName}`)

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `✅ ${className}.${handlerName}() completado en ${Date.now() - now}ms`
          )
        )
      )
  }
}
