import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const updateRoomAsync = async (
  roomUpdate: RoomType
): Promise<ReqType<RoomType>> => {
  const res: AxiosResponse = await httpClient.put(
    `/api/phong-thue/${roomUpdate.id}`,
    roomUpdate,
    {
      headers: {
        token: getCookie("accessToken") || "",
      },
    }
  );
  return res.data;
};
