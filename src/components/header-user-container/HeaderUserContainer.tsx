"use client";

import { resetProfile } from "@/app/globalRedux/features/userSlice";
import { AppDispatch, RootState } from "@/app/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { deleteCookie } from "@/utils/method/method";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Modal } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { confirm } = Modal;

type Props = {};

const HeaderUserContainer: React.FC<Props> = ({}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { getProfile } = useGetProfile();
  const { checkIsLogin } = useCheckLogin();
  const { openNotification } = useNotification();
  const { profile } = useSelector((state: RootState) => state.user);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  const showPropsConfirm = (): void => {
    confirm({
      title: "Đăng xuất",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn đăng xuất?",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk() {
        openNotification("success", "Đăng xuất", "Đăng xuất thành công");
        deleteCookie("accessToken");
        deleteCookie("i_d");
        setIsLogin(false);

        const action = resetProfile();
        dispatch(action);
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
      open={isOpenDropdown}
      onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
      dropdownRender={() => (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="flex flex-col">
            <Button
              onClick={() => {
                setIsOpenDropdown(false);
                router.push(`${isLogin === true ? "/profile" : "/auth/login"}`);
              }}
              className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
            >
              {isLogin === true ? "Xem hồ sơ" : "Đăng nhập"}
            </Button>
            {isLogin === true ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpenDropdown(false);
                }}
                className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push(`/auth/register`);
                  setIsOpenDropdown(false);
                }}
                className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
              >
                Đăng ký
              </Button>
            )}
          </div>
        </div>
      )}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <div className="border flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md">
        <FontAwesomeIcon
          size="lg"
          className="text-custome-gray-200"
          icon={faBars}
        />
        {isLogin === true ? (
          <div
            className="w-[35px] h-[35px] rounded-full border border-primary-100"
            style={{
              backgroundImage: `${
                profile.avatar === ""
                  ? `url("/images/logo.jpg")`
                  : `url("${profile.avatar}")`
              }`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        ) : (
          <div className="w-[35px] h-[35px] rounded-full border border-primary-100 flex items-center justify-center">
            <FontAwesomeIcon
              size="lg"
              className="text-custome-gray-200"
              icon={faUser}
            />
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export default HeaderUserContainer;
