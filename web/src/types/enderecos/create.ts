export interface CreateEndereco {
  bairroId: string;
  logradouro: string;
  numero: string | null;
  complemento: string | null;
  pais: string | null;
  cep: string | null;
  status: boolean;
}

export interface CreatedEndereco extends CreateEndereco {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  usuarioId: string;
  bairro: {
    id: string;
    criadoEm: string;
    atualizadoEm: string;
    codigo: string;
    nome: string;
    uf: string;
    status: true;
  };
}
