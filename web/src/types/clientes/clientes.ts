
import { BaseProps } from '../base';
import { EnderecoProps } from '../enderecos/enderecos';
export interface ClienteProps extends BaseProps {
  enderecoId?: string | null;
  usuarioId: string;
  nome: string;
  sobrenome?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  nascimento?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: EnderecoProps | null;
  status?: boolean;
}
