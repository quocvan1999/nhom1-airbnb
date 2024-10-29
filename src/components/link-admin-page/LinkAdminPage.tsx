"use client";

import { RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const LinkAdminPage: React.FC<Props> = ({}) => {
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
        <Link
          href="/admin"
          className="font-medium text-custome-black-100 px-5 py-2 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100"
        >
          Đi đến trang quản trị
        </Link>
      )}
    </>
  );
};

export default LinkAdminPage;
