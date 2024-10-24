import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const deleteBookingAsync = async (
  id: number
): Promise<ReqType<string>> => {
  const res: AxiosResponse = await httpClient.delete(`/api/dat-phong/${id}`);
  return res.data;
};
