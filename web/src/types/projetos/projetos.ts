import { BaseProps } from '../base';
import { ClienteProps } from '../clientes/clientes';
import { EstadoProps } from '../estados/estados';
import { ProjetoItemProps } from '../projeto-itens/projetoItens';
import { UpdateProjeto } from './update';

export interface ProjetoProps extends BaseProps {
  clienteId: string;
  estadoId: string;
  estado: EstadoProps;
  usuarioId: string;
  nome: string;
  valorTotal: string;
  status: UpdateProjeto['status'];
  descricao?: string | null;
  cliente: ClienteProps;
  itens: ProjetoItemProps[];
}