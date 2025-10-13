import { BaseProps } from "../base";

export interface CreateProjetoItem {
  projetoId: string;
  itemId: string;
  quantidade?: number; // default 1.0
  preco?: number; // default 0.0
  status?: boolean;
}

export interface CreatedProjetoItem extends BaseProps {
  projetoId: string;
  itemId: string;
  quantidade: string;
  preco: string;
  codigo: string;
  nomenclatura: string;
  unidade: string;
  valorTotal: string;
  status?: boolean;
}