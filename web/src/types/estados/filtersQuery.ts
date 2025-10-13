import { DefaultFilters } from '../default';

export interface EstadosFilterQuery extends DefaultFilters {
  nome?: string;
  uf?: string;
  codigoUf?: string;
  status?: string;
}
