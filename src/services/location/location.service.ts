import { LocationType } from "@/types/location/locationType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getLocationAsync = async (
  search: string = ""
): Promise<LocationType[]> => {
  let data: LocationType[] = [];
  if (search !== "") {
    const res: AxiosResponse = await httpClient.get(
      `/api/vi-tri/phan-trang-tim-kiem?pageIndex=1&pageSize=20&keyword=${search}`
    );
    data = res.data.content.data;
  } else {
    const res: AxiosResponse = await httpClient.get("/api/vi-tri");
    data = res.data.content;
  }

  return data;
};
