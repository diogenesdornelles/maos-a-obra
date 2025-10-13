import { BaseProps } from "../base";
import { ClienteProps } from "../clientes/clientes";
import { UpdateProjeto } from "./update";

export interface CreateProjeto {
  clienteId: string;
  estadoId: string;
  nome: string;
  descricao?: string | null;
}

export interface CreatedProjeto extends BaseProps {
  usuarioId: string;
  clienteId: string;
  estadoId: string;
  nome: string;
  descricao?: string | null;
  valorTotal: string;
  status: UpdateProjeto['status'];
  cliente: ClienteProps;
}