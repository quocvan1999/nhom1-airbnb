import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const updateLocationAsync = async (
  id: number,
  newLocation: LocationType
): Promise<ReqType<LocationType>> => {
  const res: AxiosResponse = await httpClient.put(
    `/api/vi-tri/${id}`,
    newLocation,
    {
      headers: {
        token: getCookie("accessToken") || "",
      },
    }
  );

  return res.data;
};
