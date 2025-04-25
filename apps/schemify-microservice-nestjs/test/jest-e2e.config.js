const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('../../../tsconfig.json') // o tsconfig.base.json si existe

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '../../../', // nos ubicamos en la raíz del proyecto
  testMatch: ['**/apps/schemify-microservice-nestjs/test/**/*.spec.ts'], // busca desde raíz
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/'
  })
}
