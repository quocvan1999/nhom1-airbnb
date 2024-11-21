"use client";

import { resetProfile } from "@/app/[locale]/globalRedux/features/userSlice";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { deleteCookie } from "@/utils/method/method";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, Modal } from "antd";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const { confirm } = Modal;

type Props = {};

const HeaderUserContainer: React.FC<Props> = ({}) => {
  const tHeader = useTranslations("HomePage");
  const tNotification = useTranslations("Notification");
  const tHeaderUserContainer = useTranslations("HeaderUserContainer");
  const locale = useLocale();
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
      title: `${tHeaderUserContainer("ConfirmLogout.title")}`,
      icon: <ExclamationCircleFilled />,
      content: `${tHeaderUserContainer("ConfirmLogout.content")}`,
      okText: `${tHeaderUserContainer("ConfirmLogout.okText")}`,
      okType: "danger",
      cancelText: `${tHeaderUserContainer("ConfirmLogout.cancelText")}`,
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk() {
        openNotification(
          "success",
          `${tNotification("HeaderUserContainer.LogoutSuccess.title")}`,
          `${tNotification("HeaderUserContainer.LogoutSuccess.content")}`
        );
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
                router.push(
                  `${
                    isLogin === true
                      ? `/${locale}/profile`
                      : `/${locale}/auth/login`
                  }`
                );
              }}
              className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
            >
              {isLogin === true
                ? `${tHeader("Header.HeaderUserContainer.viewProfile")}`
                : `${tHeader("Header.HeaderUserContainer.Login")}`}
            </Button>
            {isLogin === true ? (
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpenDropdown(false);
                }}
                className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
              >
                {tHeader("Header.HeaderUserContainer.Logout")}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push(`/${locale}/auth/register`);
                  setIsOpenDropdown(false);
                }}
                className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
              >
                {tHeader("Header.HeaderUserContainer.Singn")}
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
