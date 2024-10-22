import { ReqType } from "@/types/req/reqType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const deleteRoomAsync = async (id: number): Promise<ReqType<string>> => {
  const res: AxiosResponse = await httpClient.delete(`/api/phong-thue/${id}`, {
    headers: {
      token: getCookie("accessToken") || "",
    },
  });
  return res.data;
};
