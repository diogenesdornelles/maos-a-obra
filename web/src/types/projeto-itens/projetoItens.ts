import { BaseProps } from "../base";

export interface ProjetoItemProps extends BaseProps {
  projetoId: string;
  itemId: string;
  codigo: string | null;
  nomenclatura: string | null;
  unidade: string | null;
  preco: string;
  quantidade: string;
  valorTotal: string;
  status?: boolean;
}