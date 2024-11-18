import { setProfile } from "@/app/[locale]/globalRedux/features/userSlice";
import { AppDispatch } from "@/app/[locale]/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getProfileAsync = (id: number | undefined) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(`/api/users/${id}`);
    const action = setProfile(res.data.content);
    dispatch(action);
  };
};
