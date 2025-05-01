import type { Config } from 'jest'

const config: Config = {
  verbose: true,
  displayName: 'schemify-microservice-nestjs',
  rootDir: './test',
  testRegex: '.e2e-spec.ts$',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  testTimeout: 10_000
}

export default config
