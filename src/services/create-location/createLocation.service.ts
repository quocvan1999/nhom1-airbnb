import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";

export const createLocationAsync = async (
  newLocation: LocationType
): Promise<ReqType<LocationType>> => {
  const res = await httpClient.post("/api/vi-tri", newLocation);
  return res.data;
};
