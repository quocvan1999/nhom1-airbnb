import { LoginType } from "@/types/login/loginType.type";
import { ReqLoginType } from "@/types/req-login/reqLoginType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const LoginAsync: (user: LoginType) => Promise<ReqLoginType> = async (
  user
) => {
  const res: AxiosResponse = await httpClient.post("/api/auth/signin", user);
  return res.data;
};
