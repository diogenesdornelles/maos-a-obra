import { CreateProjeto } from "./create";

export interface UpdateProjeto extends Partial<CreateProjeto> {
    status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';
}