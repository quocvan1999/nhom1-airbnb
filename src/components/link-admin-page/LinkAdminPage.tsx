"use client";

import { RootState } from "@/app/[locale]/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import { setCookie } from "@/utils/method/method";
import { Button } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const LinkAdminPage: React.FC<Props> = ({}) => {
  const tHeader = useTranslations("HomePage");
  const locale = useLocale();
  const router = useRouter();
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const [isShow, setIsShow] = useState<boolean>(false);
  const { profile } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setIsShow(false);

    const login = checkIsLogin();

    if (login) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    if (profile.role === "ADMIN") {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  }, [profile]);

  return (
    <>
      {isShow && (
        <Button
          onClick={() => {
            setCookie(
              "auth_a",
              btoa(`${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`),
              0
            );
            router.push(`/${locale}/admin`);
          }}
          className="!border-none !shadow-none !rounded-full hover:!bg-[#b1b0b01e] !px-7 !text-sm !font-semibold !py-5 !transition-all !duration-500 !ease-in-out"
        >
          {tHeader("Header.LinkAdmin.title")}
        </Button>
      )}
    </>
  );
};

export default LinkAdminPage;
