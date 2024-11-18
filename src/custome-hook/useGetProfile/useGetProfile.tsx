"use client";

import { setProfile } from "@/app/[locale]/globalRedux/features/userSlice";
import { AppDispatch } from "@/app/[locale]/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { getProfileAsync } from "@/services/profile/profile.service";
import { User } from "@/types/user/userType.type";
import { getCookie } from "@/utils/method/method";
import { useDispatch } from "react-redux";

const useGetProfile = () => {
  const dispatch: AppDispatch = useDispatch();
  const { checkIsLogin } = useCheckLogin();
  const initProfile: User = {
    id: 0,
    avatar: "",
    birthday: "",
    email: "",
    gender: false,
    name: "",
    password: "",
    phone: "",
    role: "",
  };

  const getProfile = (): void => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      const id: string | null = getCookie("i_d");

      const action: (dispatch: AppDispatch) => Promise<void> = getProfileAsync(
        Number(id)
      );
      dispatch(action);
    } else {
      const action = setProfile(initProfile);
      dispatch(action);
    }
  };

  return { getProfile };
};

export default useGetProfile;
