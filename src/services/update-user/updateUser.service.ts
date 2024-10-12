import { ReqType } from "@/types/req/reqType.type";
import { UserUpdate } from "@/types/user-update/userUpdate.type";
import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const updateUserAsync = async (
  modelUpdate: UserUpdate
): Promise<ReqType<User>> => {
  const res: AxiosResponse = await httpClient.put(
    `/api/users/${modelUpdate.id}`,
    modelUpdate
  );
  return res.data;
};
