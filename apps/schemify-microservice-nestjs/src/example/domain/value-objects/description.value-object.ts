export class DescriptionValueObject {
  public static MAX_LENGTH = 500

  constructor(public readonly value: string | undefined) {}

  static create(description?: string | null): DescriptionValueObject {
    const trimmed = description?.trim()
    const isValid = trimmed && trimmed.length <= this.MAX_LENGTH
    return new DescriptionValueObject(isValid ? trimmed : undefined)
  }

  get isValid(): boolean {
    return this.value !== undefined
  }
}
