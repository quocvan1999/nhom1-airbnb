"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalUpdateUser from "@/components/modal-update-user/ModalUpdateUser";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { deleteCookie, formatDate, getCookie } from "@/utils/method/method";
import {
  Button,
  ConfigProvider,
  Empty,
  Modal,
  Tabs,
  TabsProps,
  Upload,
  UploadProps,
} from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ExclamationCircleFilled,
  HeartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import BookingsProfile from "@/components/bookings-profile/BookingsProfile";

const { confirm } = Modal;

type Props = {};

const ProfilePage: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { profile, bookings } = useSelector((state: RootState) => state.user);
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const [open, setOpen] = useState<boolean>(false);

  const props: UploadProps = {
    name: "formFile",
    action: "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
    headers: {
      tokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "",
      token: token,
    },
    showUploadList: false,
    beforeUpload() {
      return new Promise((resolve, reject) => {
        confirm({
          title: "Cập nhật ảnh đại diện",
          icon: <ExclamationCircleFilled />,
          content: "Bạn có muốn đổi ảnh đại diện?",
          okText: "Cập nhật",
          okType: "danger",
          cancelText: "Huỷ",
          cancelButtonProps: {
            className: "custom-cancel-button",
          },
          onOk() {
            resolve(true);
          },
          onCancel() {
            reject();
          },
        });
      });
    },
    onChange(info) {
      if (info.file.status === "done") {
        openNotification("success", "Profile", "Cập nhật avatar thành công");
        setIsLoading(!isLoading);
      } else if (info.file.status === "error") {
        openNotification(
          "error",
          "Profile",
          "Cập nhật avatar không thành công"
        );
      }
    },
  };

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

        if (checkIsLogin() === undefined || false) {
          getProfile();
        }

        setTimeout(() => {
          router.push("/");
        }, 200);
      },
    });
  };

  useEffect(() => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin !== true) {
      router.push("/auth/login");
    } else {
      const getTokent: string | null = getCookie("accessToken");
      getProfile();

      if (getTokent) {
        setToken(getTokent);
      }

      const id: string | null = getCookie("i_d");
      const action = getBookingUserAsync(Number(id));
      dispatch(action);
    }
  }, [isLoading]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            fontWeightStrong: 600,
          },
        },
      }}
    >
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[35%] xl:w-[30%] xl:px-5">
          <div
            className="w-full rounded-2xl px-6 py-8"
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full border !relative"
                style={{
                  backgroundImage: `url("${profile.avatar}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              >
                <Upload {...props}>
                  <div className="!absolute !bottom-[-10px] !left-0 !right-0 flex items-center justify-center">
                    <Button
                      className="!rounded-full !border-none !px-5 !font-bold !text-custome-gray-200 group transition-all duration-500 ease-in-out hover:!text-primary-100"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-custome-gray-200 transition-all duration-500 ease-in-out group-hover:fill-primary-100"
                      >
                        <path d="M12 9c-1.626 0-3 1.374-3 3s1.374 3 3 3 3-1.374 3-3-1.374-3-3-3z"></path>
                        <path d="M20 5h-2.586l-2.707-2.707A.996.996 0 0 0 14 2h-4a.996.996 0 0 0-.707.293L6.586 5H4c-1.103 0-2 .897-2 2v11c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-8 12c-2.71 0-5-2.29-5-5s2.29-5 5-5 5 2.29 5 5-2.29 5-5 5z"></path>
                      </svg>
                      Cập nhật
                    </Button>
                  </div>
                </Upload>
              </div>
            </div>
            {/* Thong tin */}
            <hr className="mt-10 mb-5" />

            <div>
              <h1 className="font-bold text-lg">Hồ sơ của bạn</h1>

              <div className="mt-3">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "#6a6a6a" }}
                  >
                    <path d="M20 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-6 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM19 15H9v-.25C9 12.901 11.254 11 14 11s5 1.901 5 3.75V15z"></path>
                    <path d="M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8z"></path>
                  </svg>
                  <p className="text-custome-gray-200">{profile.name}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "#6a6a6a" }}
                  >
                    <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"></path>
                  </svg>
                  <p className="text-custome-gray-200">{profile.email}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "#6a6a6a" }}
                  >
                    <path d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"></path>
                  </svg>
                  <p className="text-custome-gray-200">{profile.phone}</p>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "#6a6a6a" }}
                  >
                    <path d="M19 5h-6V2h-2v3H5C3.346 5 2 6.346 2 8v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V8c0-1.654-1.346-3-3-3zM5 7h14a1 1 0 0 1 1 1l.001 3.12c-.896.228-1.469.734-1.916 1.132-.507.45-.842.748-1.588.748-.745 0-1.08-.298-1.587-.747-.595-.529-1.409-1.253-2.915-1.253-1.505 0-2.319.724-2.914 1.253-.507.45-.841.747-1.586.747-.743 0-1.077-.297-1.582-.747-.447-.398-1.018-.905-1.913-1.133V8a1 1 0 0 1 1-1zM4 18v-4.714c.191.123.374.274.583.461C5.178 14.276 5.991 15 7.495 15c1.505 0 2.319-.724 2.914-1.253.507-.45.841-.747 1.586-.747s1.08.298 1.587.747c.595.529 1.409 1.253 2.915 1.253s2.321-.724 2.916-1.253c.211-.188.395-.34.588-.464L20.002 18H4z"></path>
                  </svg>
                  <p className="text-custome-gray-200">
                    {formatDate(profile.birthday)}
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={() => {
                    setOpen(true);
                  }}
                  className="text-custome-gray-200 font-bold w-full py-2 rounded-full transition-all duration-500 ease-in-out shadow-sm hover:shadow-lg hover:text-primary-100"
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                  }}
                >
                  Cập nhật hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[65%] xl:w-[70%]">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Phòng đã thuê",
                icon: <HistoryOutlined />,
                children: (
                  <>
                    {bookings.length > 0 ? (
                      <BookingsProfile data={bookings} />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </>
                ),
              },
              {
                key: "2",
                label: "Phòng yêu thích",
                icon: <HeartOutlined />,
                children: "Phòng yêu thích",
              },
            ]}
          />
        </div>
      </div>
      <ModalUpdateUser open={open} setOpen={setOpen} />
    </ConfigProvider>
  );
};

export default ProfilePage;
