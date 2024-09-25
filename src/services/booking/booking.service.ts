import { BookingType } from "@/types/booking/bookingType.type";
import { ReqType } from "@/types/req-login/reqLoginType.type";
import { httpClient } from "@/utils/setting/setting";

export const bookingAsync: (
  value: BookingType
) => Promise<ReqType<BookingType>> = async (value) => {
  const res = await httpClient.post("/api/dat-phong", value);
  return res.data;
};
