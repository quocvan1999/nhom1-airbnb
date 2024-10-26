import { BookingType } from "@/types/booking/bookingType.type";
import { ReqType } from "@/types/req/reqType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const updateBookingAsync = async (
  id: number,
  newBooking: BookingType
): Promise<ReqType<BookingType>> => {
  const res: AxiosResponse = await httpClient.put(
    `/api/dat-phong/${id}`,
    newBooking
  );

  return res.data;
};
