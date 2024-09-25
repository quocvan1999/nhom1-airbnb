"use client";

import { checkLogin } from "@/utils/method/method";
import { useRouter } from "next/navigation";

const useCheckLogin = () => {
  const router = useRouter();
  const checkIsLogin = () => {
    const isLogin: boolean | null = checkLogin();

    switch (isLogin) {
      case true:
        router.push("/");
        break;
      case false:
        break;
      default:
        break;
    }
  };

  return { checkIsLogin };
};

export default useCheckLogin;
