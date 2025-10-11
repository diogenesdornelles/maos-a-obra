import { DefaultFilters } from '../default';

export interface ClientesFilterQuery extends DefaultFilters {
  nome?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
}
