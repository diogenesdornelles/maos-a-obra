import { DefaultFilters } from '../default';

export interface EnderecosFilterQuery extends DefaultFilters {
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  numero?: string;
  uf?: string;
  cep?: string;
  status?: string;
}