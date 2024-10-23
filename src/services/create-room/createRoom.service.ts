import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import { getCookie } from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";

export const createRoomAsync = async (
  newRoom: RoomType
): Promise<ReqType<RoomType>> => {
  const res = await httpClient.post("/api/phong-thue", newRoom, {
    headers: {
      token: getCookie("accessToken") || "",
    },
  });
  return res.data;
};
