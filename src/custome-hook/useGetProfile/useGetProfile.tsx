"use client";

import { AppDispatch } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { getProfileAsync } from "@/services/profile/profile.service";
import { getCookie } from "@/utils/method/method";
import { useDispatch } from "react-redux";

const useGetProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const { checkIsLogin } = useCheckLogin();

  const getProfile = (): void => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      const id: string | null = getCookie("i_d");

      const action: (dispatch: AppDispatch) => Promise<void> = getProfileAsync(
        Number(id)
      );
      dispatch(action);
    }
  };

  return { getProfile };
};

export default useGetProfile;
