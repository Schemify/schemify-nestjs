export class DescriptionValueObject {
  constructor(public readonly value: string) {}

  static create(description: string): DescriptionValueObject {
    if (description.length > 500) {
      throw new Error('Description cannot exceed 500 characters')
    }
    return new DescriptionValueObject(description)
  }
}
