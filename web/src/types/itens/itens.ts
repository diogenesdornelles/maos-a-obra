export interface ItemProps {
  id: string;
  codigo: string;
  nomenclatura: string;
  unidade: string;
  status: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ItemPrecoProps {
  id: string;
  criadoEm: string;
  atualizadoEm: string;
  codigo: string;
  nomenclatura: string;
  unidade: string;
  valor: string;
  status: boolean;
}
