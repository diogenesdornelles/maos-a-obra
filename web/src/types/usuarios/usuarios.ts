import { BaseProps } from "../base";
import { ProjetoProps } from "../projetos/projetos";

export interface UsuarioProps extends BaseProps {
    id: string,
    nome: string,
    sobrenome: string,
    cpf: string,
    nascimento: string,
    email: string,
    funcao: 'ADMIN' | 'COMUM',
    status: boolean,
}

export interface MeProps extends UsuarioProps {
    projetos: ProjetoProps[];
}