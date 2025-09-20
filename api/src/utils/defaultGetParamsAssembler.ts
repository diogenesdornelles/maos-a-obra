export interface DefaultGetProps {
  skip?: number;
  take?: number;
  id?: string;
  status?: any;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  criadoEm?: string;
  [key: string]: any;
}

export function defaultGetParamsAssembler<T>(
  q: DefaultGetProps,
  where: T,
  validOrderFields: string[] = ['id'],
): { skip: number; take: number; where: T; orderBy: any } {
  if (q?.id) {
    (where as Record<string, any>).id = q.id;
  }

  if (typeof q?.status === 'boolean') {
    (where as Record<string, any>).status = q?.status;
  } else if (typeof q?.status === 'string') {
    (where as Record<string, any>).status = q?.status === 'true';
  }

  if (q?.criadoEm) {
    (where as Record<string, any>).criadoEm = { gte: new Date(q?.criadoEm) };
  }

  const orderDir = q?.orderDir || 'asc';
  const orderBy = q?.orderBy || 'id';
  const safeOrderBy = validOrderFields.includes(orderBy) ? orderBy : 'id';
  const order = { [safeOrderBy]: orderDir };

  return {
    skip: q?.skip || 0,
    take: q?.take || 10,
    where,
    orderBy: order,
  };
}
