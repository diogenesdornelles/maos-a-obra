import { DefaultFilters } from '../default';

export interface BairrosFilterQuery extends DefaultFilters {
  nome?: string;
}