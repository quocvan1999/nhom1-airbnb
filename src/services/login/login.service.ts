import { LoginType } from "@/types/login/loginType.type";
import { ReqType } from "@/types/req/reqType.type";
import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const LoginAsync = async (
  user: LoginType
): Promise<ReqType<{ user: User; token: string }>> => {
  try {
    const res: AxiosResponse = await httpClient.post("/api/auth/signin", user);
    return res.data;
  } catch (error: any) {
    return error.data;
  }
};
