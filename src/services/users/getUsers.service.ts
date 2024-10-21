import { setUsers } from "@/app/globalRedux/features/userSlice";
import { AppDispatch } from "@/app/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getUsersAsync = (
  pageIndex: number | string = 1,
  pageSize: number | string = 10,
  searchValue: string = ""
) => {
  console.log("check pagesize va pageindex", pageSize, pageIndex);

  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(
      `https://airbnbnew.cybersoft.edu.vn/api/users/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${searchValue}`
    );

    console.log("kiem tra res tra ve", res);

    const action = setUsers(res.data.content);
    dispatch(action);
  };
};
