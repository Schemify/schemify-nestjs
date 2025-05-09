import { UsuariosGestorEntity } from '../entities/usuarios-gestor.entity'
export interface UsuariosGestorRepository {
  save(entity: UsuariosGestorEntity): Promise<UsuariosGestorEntity>
  findById(id: string): Promise<UsuariosGestorEntity | null>
  findAll(): Promise<UsuariosGestorEntity[]>
  update(
    id: string,
    entity: UsuariosGestorEntity
  ): Promise<UsuariosGestorEntity>
  delete(id: string): Promise<void>
}
