export interface CreateCliente {
  nome: string;
  enderecoId?: string;
  sobrenome?: string;
  cpf?: string;
  cnpj?: string;
  nascimento?: string;
  telefone?: string;
  email?: string;
  status?: boolean;
}

export interface CreatedCliente {
  id: string;
  enderecoId: string;
  usuarioId: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  cnpj: string;
  nascimento: string;
  telefone: string;
  email: string;
  status: boolean;
  criadoEm: string;
  atualizadoEm: string;
  endereco: {
    id: string;
    logradouro: string;
    numero: string;
    complemento: string;
    usuarioId: string;
    bairroId: string;
    pais: string;
    cep: string;
    status: boolean;
    criadoEm: string;
    atualizadoEm: string;
  };
}
