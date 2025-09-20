import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

export interface TokenPayload {
  id: string;
  email: string;
  funcao: Funcao;
  cpf: string;
}
