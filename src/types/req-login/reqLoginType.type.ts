import { RegisterType } from "@/types/register/registerType.type";

export type ReqLoginType = {
  statusCode: number;
  content: {
    user: RegisterType;
    token: string;
  };
  dateTime: string;
  message?: string;
};
