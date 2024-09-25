"use client";

import { checkLogin } from "@/utils/method/method";

const useCheckLogin = () => {
  const checkIsLogin = () => {
    const isLogin: boolean | null = checkLogin();

    switch (isLogin) {
      case true:
        break;
      case false:
        break;
      default:
        break;
    }
  };
  return {};
};

export default useCheckLogin;
