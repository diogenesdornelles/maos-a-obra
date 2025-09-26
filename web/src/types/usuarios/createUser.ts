export interface CreatedUser {
  id: string;
  nome: string;
  sobrenome: string;
  cpf: string;
  nascimento: string;
  email: string;
  funcao: string;
  status: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateUserForm {
  nome: string;
  sobrenome: string;
  cpf: string;
  nascimento: string;
  email: string;
  senha: string;
}

export interface InsertUserComplete extends CreateUserForm {
  funcao: string;
  status: boolean;
}
