import { User } from "@/types/user/userType.type";

export type ReqLoginType = {
  statusCode: number;
  content: {
    user: User;
    token: string;
  };
  dateTime: string;
  message?: string;
};
