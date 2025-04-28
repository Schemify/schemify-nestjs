// entidad + repositorio + value object

import { DescriptionValueObject } from '../value-objects/description.value-object'
import { v4 as uuidv4 } from 'uuid'

export class ExampleEntity {
  readonly id: string
  name: string
  description: DescriptionValueObject
  readonly createdAt: Date
  updatedAt?: Date

  private constructor(props: {
    id?: string
    name: string
    description: DescriptionValueObject
    createdAt?: Date
    updatedAt?: Date
  }) {
    this.id = props.id || uuidv4()
    this.name = props.name
    this.description = props.description
    this.createdAt = props.createdAt || new Date()
    this.updatedAt = props.updatedAt
  }

  static create(props: { name: string; description?: string }): ExampleEntity {
    if (!props.name || props.name.trim().length < 3) {
      throw new Error('Name must be at least 3 characters')
    }

    return new ExampleEntity({
      name: props.name,
      description: DescriptionValueObject.create(props.description || '')
    })
  }

  update(props: { name?: string; description?: string }): void {
    if (props.name) {
      if (props.name.trim().length < 3) {
        throw new Error('Name must be at least 3 characters')
      }
      this.name = props.name
    }

    if (props.description !== undefined) {
      this.description = DescriptionValueObject.create(props.description)
    }

    this.updatedAt = new Date()
  }

  static reconstruct(props: {
    id: string
    name: string
    description: string
    createdAt: Date
    updatedAt?: Date
  }): ExampleEntity {
    // reconstrucción desde persistencia
    return new ExampleEntity({
      id: props.id,
      name: props.name,
      description: DescriptionValueObject.create(props.description),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    })
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
