import { setLocations } from "@/app/[locale]/globalRedux/features/roomSlice";
import { AppDispatch } from "@/app/[locale]/globalRedux/store";
import { httpClient } from "@/utils/setting/setting";
import { AxiosResponse } from "axios";

export const getLocationsPaginationAsync = (
  pageIndex: string,
  pageSize: string,
  searchValue: string
) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const res: AxiosResponse = await httpClient.get(
      `/api/vi-tri/phan-trang-tim-kiem?pageIndex=${pageIndex}&pageSize=${pageSize}&keyword=${searchValue}`
    );

    const action = setLocations(res.data.content);
    dispatch(action);
  };
};
