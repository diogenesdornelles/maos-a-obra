import { EnderecoProps } from '../enderecos/enderecos';

export interface ClienteProps {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  enderecoId: string;
  usuarioId: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  cnpj: string;
  nascimento: string;
  telefone: string;
  email: string;
  status: boolean;
  endereco: EnderecoProps;
}
