import { DefaultFilters } from '../default';

export interface EnderecosFilterQuery extends DefaultFilters {
  logradouro?: string;
  cep?: string;
  numero?: number;
}