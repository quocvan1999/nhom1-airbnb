import { setComments } from "@/app/globalRedux/features/roomSlice";
import { AppDispatch } from "@/app/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getCommentToRoomAsync = (id: number | string) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(
      `/api/binh-luan/lay-binh-luan-theo-phong/${id}`
    );
    const action = setComments(res.data.content);
    dispatch(action);
  };
};
