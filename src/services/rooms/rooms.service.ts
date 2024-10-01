import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getRoomsAsync = async (
  pageIndex: number | string,
  pageSize: number | string
): Promise<reqPaginationType<RoomType[]>> => {
  const res: AxiosResponse = await httpClient.get(
    `/api/phong-thue/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
  return res.data.content;
};
