import { LoginType } from "@/types/login/loginType.type";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const LoginAsync: (
  user: LoginType
) => Promise<ReqType<{ user: User; token: string }>> = async (user) => {
  try {
    const res: AxiosResponse = await httpClient.post("/api/auth/signin", user);
    return res.data;
  } catch (error: any) {
    return error.data;
  }
};
