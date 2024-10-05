"use client";

import { RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { deleteCookie } from "@/utils/method/method";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Dropdown, Modal } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const { confirm } = Modal;

type Props = {};

const HeaderUserContainer: React.FC<Props> = ({}) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { getProfile } = useGetProfile();
  const { checkIsLogin } = useCheckLogin();
  const { openNotification } = useNotification();
  const { profile } = useSelector((state: RootState) => state.user);

  const showPropsConfirm = (): void => {
    confirm({
      title: "Đăng xuất",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn đăng xuất?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Huỷ",
      onOk() {
        openNotification("success", "Đăng xuất", "Đăng xuất thành công");
        deleteCookie("accessToken");
        deleteCookie("i_d");
        setIsLogin(false);
      },
    });
  };

  const handleLogout = (): void => {
    showPropsConfirm();
  };

  useEffect(() => {
    const login = checkIsLogin();
    if (login === true) {
      setIsLogin(true);
      getProfile();
    } else {
      setIsLogin(false);
    }
  }, []);

  return (
    <Dropdown
      dropdownRender={() => (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="flex flex-col">
            <Link
              href={`${isLogin === true ? "/profile" : "/auth/login"}`}
              className="transition-all duration-500 ease-in-out text-custome-black-100 hover:bg-custome-gray-100 hover:text-custome-black-100 px-5 py-2 rounded-t-lg"
            >
              {isLogin === true ? "Xem hồ sơ" : "Đăng nhập"}
            </Link>
            {isLogin === true ? (
              <Button
                onClick={handleLogout}
                className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
              >
                Đăng xuất
              </Button>
            ) : (
              <Link
                href="/auth/register"
                className="transition-all duration-500 ease-in-out text-custome-black-100 hover:bg-custome-gray-100 hover:text-custome-black-100 px-5 py-2 rounded-b-lg"
              >
                Đăng ký
              </Link>
            )}
          </div>
        </div>
      )}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <div className="border flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ fill: "#222" }}
        >
          <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
        </svg>
        {isLogin === true ? (
          <div
            className="w-[35px] h-[35px] rounded-full border border-primary-100"
            style={{
              backgroundImage: `url("${profile.avatar}")`,
              backgroundSize: "cover",
            }}
          ></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            style={{ fill: "#222" }}
          >
            <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path>
          </svg>
        )}
      </div>
    </Dropdown>
  );
};

export default HeaderUserContainer;
