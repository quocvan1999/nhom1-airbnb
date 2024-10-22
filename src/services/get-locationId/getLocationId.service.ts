import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getLocationIdAsync = async (
  id: number
): Promise<ReqType<LocationType>> => {
  const res: AxiosResponse = await httpClient.get(`/api/vi-tri/${id}`);
  return res.data;
};
