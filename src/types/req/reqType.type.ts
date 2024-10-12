export type ReqType<T> = {
  statusCode: number;
  content: T | string;
  dateTime: string;
  message?: string;
};
