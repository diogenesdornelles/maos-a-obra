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
  bairro: {
    id: string;
    criadoEm: string;
    atualizadoEm: string;
    codigo: string;
    nome: string;
    uf: string;
    status: boolean;
  };
}
