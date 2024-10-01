import { setBookings } from "@/app/globalRedux/features/roomSlice";
import { AppDispatch } from "@/app/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getBookingsAsync = async (
  dispatch: AppDispatch
): Promise<void> => {
  const res: AxiosResponse = await httpClient.get("/api/dat-phong");
  const action = setBookings(res.data.content);
  dispatch(action);
};
