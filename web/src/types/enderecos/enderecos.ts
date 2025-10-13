import { BairrosProps } from '../bairros/bairros';
import { BaseProps } from '../base';

export interface EnderecoProps extends BaseProps {
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  bairroId: string;
  usuarioId: string;
  pais: string;
  cep?: string | null;
  status?: boolean;
  bairro: BairrosProps;
}
