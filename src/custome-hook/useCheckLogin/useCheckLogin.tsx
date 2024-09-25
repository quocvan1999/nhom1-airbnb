import { checkLogin } from "@/utils/method/method";

const useCheckLogin = () => {
  const checkIsLogin = () => {
    const login: boolean | null = checkLogin();

    switch (login) {
      case true:
        return true;
      case false:
        return false;
      default:
        break;
    }
  };

  return { checkIsLogin };
};

export default useCheckLogin;
