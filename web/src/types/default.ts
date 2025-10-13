export interface DefaultFilters {
  id?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}
