"use client";

import { RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import { setCookie } from "@/utils/method/method";
import { Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const LinkAdminPage: React.FC<Props> = ({}) => {
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
            router.push("/admin");
          }}
          className="!border-none !shadow-none !rounded-full hover:!bg-[#b1b0b01e] !px-7 !text-sm !font-semibold !py-5 !transition-all !duration-500 !ease-in-out"
        >
          Đi đến trang quản trị
        </Button>
      )}
    </>
  );
};

export default LinkAdminPage;
