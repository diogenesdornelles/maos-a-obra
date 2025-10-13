import { DefaultFilters } from "../default";
import { UpdateProjeto } from "./update";

export interface ProjetosFilterQuery extends DefaultFilters {
  nome?: string;
  clienteId?: string;
  usuarioId?: string;
  descricao?: string;
  valorMax?: number;
  valorMin: number;
  status?: UpdateProjeto['status'];
}