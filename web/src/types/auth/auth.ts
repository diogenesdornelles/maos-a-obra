export interface LoginProps {
  email: string;
  pass: string;
}

export interface TokenAcess {
  access_token: string;
}

export interface SessionProps {
  id: string;
  email: string;
  funcao: string;
  cpf: string;
  iat: number;
  exp: number;
}
