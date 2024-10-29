"use client";

import React, { useEffect, useState } from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Dropdown } from "antd";
import { NotifiType } from "@/types/notifi/notifi.type";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import { useSelector } from "react-redux";
import { RootState } from "@/app/globalRedux/store";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";

type Props = {};

const HeaderNotificationClient: React.FC<Props> = ({}) => {
  const [isLogin, setIslogin] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotifiType[] | null>(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const { profile } = useSelector((state: RootState) => state.user);

  const getNotification = (): void => {
    const notifications: NotifiType[] = JSON.parse(
      localStorage.getItem(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`
      ) || "[]"
    );

    setNotification(notifications);
  };

  useEffect(() => {
    setIslogin(false);
    const login: boolean | undefined = checkIsLogin();

    if (login === true) {
      getProfile();
      setIslogin(true);
    } else {
      setIslogin(false);
    }
  }, []);

  useEffect(() => {
    getNotification();
  }, [profile]);

  return (
    <>
      {isLogin && notification !== null && (
        <Dropdown
          open={isOpenDropdown}
          onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
          dropdownRender={() => (
            <div className="bg-white shadow-lg rounded-lg w-[300px] h-[350px] py-5 px-2">
              <h1 className="font-bold uppercase">Thông báo</h1>
              <hr className="mt-2 mb-3" />

              <div>
                {notification.length > 0 ? (
                  notification.map((item: NotifiType, index: number) => (
                    <div key={index}>{item.title}</div>
                  ))
                ) : (
                  <div className="flex w-full h-[150px] items-center justify-center">
                    Không có thông báo mới
                  </div>
                )}
              </div>
            </div>
          )}
          placement="bottomLeft"
          trigger={["click"]}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100 me-2">
            <Badge count={notification.length}>
              <FontAwesomeIcon
                size="xl"
                className="text-custome-gray-200 cursor-pointer"
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
