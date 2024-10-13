export type ReqType<T> = {
  statusCode: number;
  content: T | string | null;
  dateTime: string;
  message?: string;
};
