import { RoomType } from "@/types/room/roomType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getRoomsLocation: (
  keyword: string | number
) => Promise<RoomType[]> = async (keyword = "") => {
  const res: AxiosResponse = await httpClient.get(
    `/api/phong-thue/lay-phong-theo-vi-tri?maViTri=${keyword}`
  );
  return res.data.content;
};
