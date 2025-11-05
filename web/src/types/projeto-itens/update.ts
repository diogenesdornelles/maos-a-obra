export interface UpdateProjetoItem {
  id: string;
  projetoId?: string;
  itemId?: string;
  quantidade?: string;
  preco?: string;
  status?: boolean;
}

export interface UpdatedProjetoItem {
  id: string;
  projetoId: string;
  itemId: string;
  quantidade: string;
  preco: string;
  codigo: string;
  nomenclatura: string;
  unidade: string;
  valorTotal: string;
  status: boolean;
}