import { ReqType } from "@/types/req/reqType.type";
import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";

export const registerAsync = async (newUser: User): Promise<ReqType<User>> => {
  const res = await httpClient.post("/api/auth/signup", newUser);
  return res.data;
};
