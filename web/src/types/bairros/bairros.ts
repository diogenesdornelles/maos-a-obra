import { BaseProps } from "../base";

export interface BairrosProps extends BaseProps {
  codigo: string;
  nome: string;
  uf: string;
  status?: boolean;
}