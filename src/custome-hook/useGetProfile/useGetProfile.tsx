"use client";

import { AppDispatch } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { getProfileAsync } from "@/services/profile/profile.service";
import { getCookie } from "@/utils/method/method";
import { useDispatch } from "react-redux";

const useGetProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const { checkIsLogin } = useCheckLogin();

  const getProfile: () => void = async () => {
    const isLogin = checkIsLogin();

    if (isLogin === true) {
      const id = getCookie("i_d");

      const action = getProfileAsync(Number(id));
      dispatch(action);
    }
  };
  return { getProfile };
};

export default useGetProfile;
