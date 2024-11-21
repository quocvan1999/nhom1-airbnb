"use client";

import { RootState } from "@/app/[locale]/globalRedux/store";
import HeaderNotificationClient from "@/components/header-notification-client/HeaderNotificationClient";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { faHouse, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const NavMobile: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const tNavMobile = useTranslations("NavMobile");
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
          <p className="text-xs">{tNavMobile("NotificationTitle")}</p>
        </Link>
      )}
      <Link
        href={`${
          isLogin === true ? `/${locale}/profile` : `/${locale}/auth/login`
        }`}
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div
          className={`rounded-full flex items-center justify-center transition-all duration-500 ease-in-out  group-hover:border-primary-100 ${
            isLogin === true
              ? "w-[50px] h-[50px] border border-custome-gray-200"
              : "w-[35px] h-[35px]"
          }`}
          style={{
            backgroundImage: `url("${profile.avatar}")`,
            backgroundSize: "cover",
          }}
        >
          {isLogin === false && (
            <FontAwesomeIcon
              size="xl"
              className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
              icon={faUser}
            />
          )}
        </div>
        <p className="text-xs">
          {isLogin === true
            ? `${tNavMobile("ProfileTitle")}`
            : `${tNavMobile("LoginTitle")}`}
        </p>
      </Link>
      <Link
        href={`/${locale}`}
        className="flex flex-col items-center gap-1 transition-all duration-500 ease-in-out hover:text-primary-100 group"
      >
        <div className="w-[35px] h-[35px] rounded-full flex items-center justify-center">
          <FontAwesomeIcon
            size="xl"
            className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
            icon={faHouse}
          />
        </div>
        <p className="text-xs">{tNavMobile("HomeTitle")}</p>
      </Link>
    </div>
  );
};

export default NavMobile;
