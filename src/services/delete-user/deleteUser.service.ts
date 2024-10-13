import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const deleteUserAsync = async (id: number): Promise<ReqType<string>> => {
  const res: AxiosResponse = await httpClient.delete(`/api/users?id=${id}`);
  return res.data;
};
