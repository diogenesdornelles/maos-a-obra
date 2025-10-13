import { BaseProps } from "../base";

export interface ItemProps extends BaseProps {
  codigo: string;
  nomenclatura: string;
  unidade: string;
  status?: boolean;
}

export interface ItemPrecoProps extends BaseProps {
  codigo: string;
  nomenclatura: string;
  unidade: string;
  valor: string;
  status?: boolean;
}
