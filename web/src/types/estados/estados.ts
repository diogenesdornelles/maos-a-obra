import { BaseProps } from "../base";

export interface EstadoProps extends BaseProps {
  codigoUf: string;
  nome: string;
  uf: string;
  regiao: number;
  status?: boolean;
}
