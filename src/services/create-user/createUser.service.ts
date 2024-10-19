import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";

export const createUserAsync = async (newUser: User) => {
  const res = await httpClient.post("/api/users", newUser);
  return res.data;
};
