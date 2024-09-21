import { LocationType } from "@/types/location/locationType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getLocationAsync: () => Promise<LocationType[]> = async () => {
  const res: AxiosResponse = await httpClient.get("/api/vi-tri");
  return res.data.content;
};
