import { setUsers } from "@/app/[locale]/globalRedux/features/userSlice";
import { AppDispatch } from "@/app/[locale]/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getUsersPaginationAsync = (
  pageIndex: string,
  pageSize: string,
  searchValue: string
) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(
      `/api/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${searchValue}`
    );

    const action = setUsers(res.data.content);
    dispatch(action);
  };
};
