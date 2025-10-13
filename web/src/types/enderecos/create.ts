import { BairrosProps } from "../bairros/bairros";

export interface CreateEndereco {
  bairroId: string;
  logradouro: string;
  numero?: string | null;
  complemento?: string | null;
  pais?: string | null;
  cep?: string | null;
  status?: boolean;
}

export interface CreatedEndereco extends CreateEndereco {
  usuarioId: string;
  bairro: BairrosProps;
}