import { DefaultFilters } from '../default';

export interface ItensFilterQuery extends DefaultFilters {
  nomenclatura?: string;
}

export interface ItensPrecoFilterQuery extends DefaultFilters {
  itemId: string;
  estadoId: string;
}
