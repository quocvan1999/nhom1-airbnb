"use client";

import { RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const NavMobile: React.FC<Props> = ({}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();
  const { profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const login = checkIsLogin();

    if (login === true) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [profile]);

  return (
    <div className="w-full py-2 flex items-center justify-center gap-10">
      <Link
        href="/"
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: "#6A6A6A" }}
            className="transition-all duration-500 ease-in-out group-hover:!fill-primary-100"
          >
            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
          </svg>
        </div>
        <p>Khám phá</p>
      </Link>
      <Link
        href="/"
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: "#6A6A6A" }}
            className="transition-all duration-500 ease-in-out group-hover:!fill-primary-100"
          >
            <path d="M12.71 2.29a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42A1 1 0 0 0 3 13h1v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7h1a1 1 0 0 0 1-1 1 1 0 0 0-.29-.71zM6 20v-9.59l6-6 6 6V20z"></path>
          </svg>
        </div>
        <p>Trang chủ</p>
      </Link>
      <Link
        href={`${isLogin === true ? "/profile" : "/auth/login"}`}
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div
          className="w-[35px] h-[35px] rounded-full border flex items-center justify-center transition-all duration-500 ease-in-out border-custome-gray-200 group-hover:border-primary-100"
          style={{
            backgroundImage: `url("${profile.avatar}")`,
            backgroundSize: "cover",
          }}
        >
          {isLogin === false && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "#6A6A6A" }}
              className="transition-all duration-500 ease-in-out group-hover:!fill-primary-100"
            >
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"></path>
            </svg>
          )}
        </div>
        <p>{isLogin === true ? "Hồ sơ" : "Đăng nhập"}</p>
      </Link>
    </div>
  );
};

export default NavMobile;
