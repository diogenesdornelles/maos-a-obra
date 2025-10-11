import { BairrosProps } from '../bairros/bairros';

export interface EnderecoProps {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairroId: string;
  usuarioId: string;
  pais: string;
  cep: string;
  status: boolean;
  bairro: BairrosProps;
}