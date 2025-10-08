import { DefaultFilters } from '../default';

export interface EnderecosFilterQuery extends DefaultFilters {
  logradouro: string | null;
  cep: string | null;
  numero: number | null;
}
