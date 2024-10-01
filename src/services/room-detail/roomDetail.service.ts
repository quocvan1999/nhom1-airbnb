import { RoomType } from "@/types/room/roomType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getRoomDetailAsync = async (
  id: number | string
): Promise<RoomType> => {
  const res: AxiosResponse = await httpClient.get(`/api/phong-thue/${id}`);
  return res.data.content;
};
