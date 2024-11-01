"use client";

import { RootState } from "@/app/globalRedux/store";
import HeaderNotificationClient from "@/components/header-notification-client/HeaderNotificationClient";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import {
  faBed,
  faBell,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      {isLogin && (
        <Link
          href=""
          className="flex flex-col items-center justify-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
        >
          <HeaderNotificationClient userType="client" type="mobile" />
          <p>Thông báo</p>
        </Link>
      )}
      <Link
        href="/"
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center">
          <FontAwesomeIcon
            size="xl"
            className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
            icon={faHouse}
          />
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
            <FontAwesomeIcon
              size="lg"
              className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
              icon={faUser}
            />
          )}
        </div>
        <p>{isLogin === true ? "Hồ sơ" : "Đăng nhập"}</p>
      </Link>
    </div>
  );
};

export default NavMobile;
