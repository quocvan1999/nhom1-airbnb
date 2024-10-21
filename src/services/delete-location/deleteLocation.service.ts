import { ReqType } from "@/types/req/reqType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const deleteLocationAsync = async (
  id: number
): Promise<ReqType<string>> => {
  const res: AxiosResponse = await httpClient.delete(`/api/vi-tri/${id}`, {
    headers: {
      token: getCookie("accessToken") || "",
    },
  });
  return res.data;
};
