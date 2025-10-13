import { DefaultFilters } from '../default';

export interface ClientesFilterQuery extends DefaultFilters {
  nome?: string;
  sobrenome?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  telefone?: string;
  status?: string;
}
