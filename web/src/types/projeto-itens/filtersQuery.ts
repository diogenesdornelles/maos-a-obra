import { DefaultFilters } from "../default";

export interface ProjetoItensFilterQuery extends DefaultFilters {
  projetoId?: string;
  itemId?: string;
  status?: string;
  quantidade?: number;
}