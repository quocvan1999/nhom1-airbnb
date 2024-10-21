import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";

export const createLocationAsync = async (
  newLocation: LocationType
): Promise<ReqType<LocationType>> => {
  const res = await httpClient.post("/api/vi-tri", newLocation, {
    headers: {
      token: getCookie("accessToken") || "",
    },
  });
  return res.data;
};
