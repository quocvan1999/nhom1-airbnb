import { BookingType } from "@/types/booking/bookingType.type";
import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";

export const bookingAsync = async (
  value: BookingType
): Promise<ReqType<BookingType>> => {
  const res = await httpClient.post("/api/dat-phong", value);
  return res.data;
};
