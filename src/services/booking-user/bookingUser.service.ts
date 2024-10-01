import { setBooking } from "@/app/globalRedux/features/userSlice";
import { AppDispatch } from "@/app/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getBookingUserAsync = (id: number) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(
      `/api/dat-phong/lay-theo-nguoi-dung/${id}`
    );
    const action = setBooking(res.data.content);
    dispatch(action);
  };
};
