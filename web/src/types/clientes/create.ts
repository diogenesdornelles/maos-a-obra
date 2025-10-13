import { BaseProps } from "../base";
import { EnderecoProps } from "../enderecos/enderecos";

export interface CreateCliente {
  enderecoId?: string | null;
  nome: string;
  sobrenome?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  nascimento?: string | null;
  telefone?: string | null;
  email?: string | null;
  status?: boolean;
}

export interface CreatedCliente extends BaseProps {
  enderecoId: string | null;
  usuarioId: string;
  nome: string;
  sobrenome: string | null;
  cpf: string | null;
  cnpj: string | null;
  nascimento: string | null;
  telefone: string | null;
  email: string | null;
  status?: boolean;
  endereco: EnderecoProps | null;
}
