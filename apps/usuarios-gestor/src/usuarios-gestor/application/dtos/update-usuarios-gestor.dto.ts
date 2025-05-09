import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator'

export class UpdateUsuariosGestorDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string
}
