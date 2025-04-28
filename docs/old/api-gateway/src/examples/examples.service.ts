// import { Injectable, OnModuleInit, Inject } from '@nestjs/common'
// import {
//   CreateExampleDto,
//   EXAMPLE_SERVICE_NAME,
//   ExampleServiceClient,
//   UpdateExampleDto
// } from '@app/common'
// import { ClientGrpc } from '@nestjs/microservices'
// import { EXAMPLE_SERVICE } from './constants'

// import { Observable, ReplaySubject } from 'rxjs'
// import {
//   Example,
//   Examples,
//   Empty,
//   GetExampleByIdDto,
//   PaginationDto
// } from '@app/common'

// @Injectable()
// export class ExamplesService implements OnModuleInit {
//   private ExamplesService: ExampleServiceClient

//   constructor(@Inject(EXAMPLE_SERVICE) private client: ClientGrpc) {}

//   onModuleInit() {
//     this.ExamplesService =
//       this.client.getService<ExampleServiceClient>(EXAMPLE_SERVICE_NAME)
//   }

//   createExample(request: CreateExampleDto): Observable<Example> {
//     return this.ExamplesService.createExample(request)
//   }

//   getAllExamples(): Observable<Examples> {
//     return this.ExamplesService.getAllExamples({})
//   }

//   getExampleById(request: GetExampleByIdDto): Observable<Example> {
//     return this.ExamplesService.getExampleById(request)
//   }

//   updateExample(request: UpdateExampleDto): Observable<Example> {
//     return this.ExamplesService.updateExample(request)
//   }

//   deleteExample(request: GetExampleByIdDto): Observable<Empty> {
//     return this.ExamplesService.deleteExample(request)
//   }

//   queryExamples(request: Observable<PaginationDto>): Observable<Examples> {
//     return this.ExamplesService.queryExamples(request)
//   }

//   paginationExample() {
//     const examples$ = new ReplaySubject<PaginationDto>()

//     examples$.next({ page: 0, skip: 25 })
//     examples$.next({ page: 1, skip: 25 })
//     examples$.next({ page: 2, skip: 25 })
//     examples$.next({ page: 3, skip: 25 })

//     examples$.complete()

//     let chunkNumer = 1

//     this.ExamplesService.queryExamples(examples$).subscribe((examples) => {
//       console.log('"Chunk"', chunkNumer, examples)
//       chunkNumer++
//     })
//   }
// }
