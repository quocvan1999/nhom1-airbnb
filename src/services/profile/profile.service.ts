import { setProfile } from "@/app/globalRedux/features/profileSlice";
import { AppDispatch } from "@/app/globalRedux/store";
import { User } from "@/types/user/userType.type";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getProfileAsync = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const res: AxiosResponse = await httpClient.get(`/api/users/${id}`);

    const action = setProfile(res.data.content);
    dispatch(action);
  };
};
