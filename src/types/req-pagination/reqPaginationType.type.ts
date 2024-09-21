export type reqPaginationType<T> = {
  pageIndex: number;
  pageSize: number;
  totalRow: number;
  keywords: string | null;
  data: T;
};
