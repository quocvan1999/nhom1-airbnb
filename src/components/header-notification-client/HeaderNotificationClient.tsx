"use client";

import React, { useEffect, useState } from "react";
import { faBell, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Dropdown } from "antd";
import { NotifiType } from "@/types/notifi/notifi.type";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { useSelector } from "react-redux";
import { RootState } from "@/app/[locale]/globalRedux/store";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { useTranslations } from "next-intl";

type Props = {
  type: "mobile" | "table" | "destop";
  userType: "client" | "admin";
};

const HeaderNotificationClient: React.FC<Props> = ({
  type = "destop",
  userType,
}) => {
  const tHeader = useTranslations("HomePage");
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotifiType[] | null>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();
  const { profile } = useSelector((state: RootState) => state.user);
  const { removeNotification, cleanNotification } = useNotifiCustome();
  const { isLoadingNotification } = useSelector(
    (state: RootState) => state.statusAppSlice
  );

  const getNotification = (): void => {
    const notifications: NotifiType[] = JSON.parse(
      localStorage.getItem(
        `${
          userType === "client"
            ? process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT
            : process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN
        }-${profile.id}`
      ) || "[]"
    );

    setNotification(notifications);
  };

  const deleteNotification = (id: string): void => {
    removeNotification(
      `${
        userType === "client"
          ? process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT
          : process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN
      }-${profile.id}`,
      id
    );
    getNotification();
  };

  useEffect(() => {
    setIslogin(false);
    const login: boolean | undefined = checkIsLogin();

    if (login === true) {
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, [profile]);

  useEffect(() => {
    getNotification();
  }, [isLoadingNotification, profile]);

  return (
    <>
      {isLogin && notification !== null && (
        <Dropdown
          open={isOpenDropdown}
          onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
          dropdownRender={() => (
            <div
              className={`bg-white shadow-xl rounded-xl w-[300px] md:w-[350px] py-5 px-2`}
            >
              <h1 className="font-bold uppercase">
                {tHeader("Header.Notification.title")}
              </h1>

              <div className="flex flex-col h-full">
                <div>
                  {notification.length > 0 ? (
                    notification.map((item: NotifiType, index: number) => (
                      <div
                        key={index}
                        className="w-full border-b p-2 flex items-start gap-2 relative rounded-xl overflow-hidden group"
                      >
                        <div className="w-[40px] h-[40px] rounded-full border border-primary-100 flex items-center justify-center">
                          <FontAwesomeIcon
                            size="xl"
                            className="text-primary-100 cursor-pointer"
                            icon={faBell}
                          />
                        </div>
                        <div className="w-[calc(100%-48px)]">
                          <h1 className="text-black font-bold">{item.title}</h1>
                          <div className="mt-1">
                            <p className="">{item.content}</p>
                            <p className="text-custome-gray-200 text-xs italic">
                              {item.date}
                            </p>
                          </div>
                        </div>
                        <div className="absolute hidden top-0 left-0 right-0 bg-[#6a6a6a7c] w-full h-full transition-all duration-500 ease-in-out group-hover:block">
                          <div className="w-full h-full flex items-center justify-end p-2">
                            <FontAwesomeIcon
                              onClick={() => {
                                deleteNotification(item.id);
                              }}
                              size="lg"
                              className="text-white cursor-pointer"
                              icon={faXmark}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex w-full h-[150px] items-center justify-center">
                      {tHeader("Header.Notification.content")}
                    </div>
                  )}
                </div>
                {notification.length > 0 && (
                  <div
                    onClick={() => {
                      cleanNotification(
                        `${
                          userType === "client"
                            ? process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT
                            : process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN
                        }-${profile.id}`
                      );
                      getNotification();
                    }}
                    className="flex items-center justify-center mt-4 text-custome-gray-200 duration-500 transition-all ease-in-out hover:text-primary-100 cursor-pointer"
                  >
                    {tHeader("Header.Notification.titleDelete")}
                  </div>
                )}
              </div>
            </div>
          )}
          placement={type === "destop" ? "bottomLeft" : "topCenter"}
          trigger={["click"]}
        >
          <div
            className={`${
              type === "destop"
                ? "me-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100"
                : "w-[35px] h-[35px] rounded-full flex items-center justify-center"
            }`}
          >
            <Badge count={notification.length}>
              <FontAwesomeIcon
                size="xl"
                className={`${
                  type === "destop"
                    ? "text-custome-gray-200 cursor-pointer"
                    : "text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
                }`}
                icon={faBell}
              />
            </Badge>
          </div>
        </Dropdown>
      )}
    </>
  );
};

export default HeaderNotificationClient;
