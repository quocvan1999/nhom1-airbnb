"use client";

import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import ModalUpdateUser from "@/components/modal-update-user/ModalUpdateUser";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import {
  deleteCookie,
  formatDate,
  getCookie,
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import {
  Button,
  ConfigProvider,
  Empty,
  Image,
  Modal,
  Tabs,
  Upload,
  UploadProps,
} from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExclamationCircleFilled } from "@ant-design/icons";
import BookingsProfile from "@/components/bookings-profile/BookingsProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faCamera,
  faClockRotateLeft,
  faEnvelope,
  faHeart,
  faPhone,
  faUserTag,
} from "@fortawesome/free-solid-svg-icons";
import FavouriteRoom from "@/components/favourite-room-profile/FavouriteRoom";
import { NotifiType } from "@/types/notifi/notifi.type";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { resetProfile } from "@/app/[locale]/globalRedux/features/userSlice";
import { useLocale, useTranslations } from "next-intl";

const { confirm } = Modal;

type Props = {};

const ProfilePage: React.FC<Props> = ({}) => {
  const tNotification = useTranslations("Notification");
  const tProfilePage = useTranslations("ProfilePage");
  const tLocalNotifi = useTranslations("LocalNotifi");
  const locale = useLocale();
  const router: AppRouterInstance = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { profile, bookings } = useSelector((state: RootState) => state.user);
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const [open, setOpen] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { createNotification } = useNotifiCustome();

  const props: UploadProps = {
    name: "formFile",
    action: "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
    headers: {
      tokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "",
      token: token,
    },
    showUploadList: false,
    beforeUpload(file: any) {
      return new Promise((resolve, reject) => {
        let isPass: boolean = true;
        if (file) {
          const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
          if (!allowedExtensions.exec(file.name)) {
            reject();
            isPass = false;
            openNotification(
              "error",
              `${tNotification("ProfilePage.ErrorUploadImage1.title")}`,
              `${tNotification("ProfilePage.ErrorUploadImage1.content")}`
            );
            return;
          }

          const maxSizeInBytes = 1 * 1024 * 1024;
          if (file.size > maxSizeInBytes) {
            reject();
            isPass = false;
            openNotification(
              "error",
              `${tNotification("ProfilePage.ErrorUploadImage2.title")}`,
              `${tNotification("ProfilePage.ErrorUploadImage2.content")}`
            );
            return;
          }

          if (isPass) {
            confirm({
              title: `${tProfilePage("ConfirmUpdateImage.title")}`,
              icon: <ExclamationCircleFilled />,
              content: `${tProfilePage("ConfirmUpdateImage.content")}`,
              okText: `${tProfilePage("ConfirmUpdateImage.okText")}`,
              okType: "danger",
              cancelText: `${tProfilePage("ConfirmUpdateImage.cancelText")}`,
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
          }
        }
      });
    },
    onChange(info) {
      if (info.file.status === "done") {
        openNotification(
          "success",
          `${tNotification("ProfilePage.UpdateAvatarSucces.title")}`,
          `${tNotification("ProfilePage.UpdateAvatarSucces.content")}`
        );
        setIsLoading(!isLoading);

        const newNotification: NotifiType = {
          id: `Pro${getFormattedDateTime()}`,
          title: `${tLocalNotifi("ProfilePage.UpdateAvatarSucces.title")}`,
          content: `${tLocalNotifi("ProfilePage.UpdateAvatarSucces.content")}`,
          date: `${getCurrentDateTime()}`,
          type: "success",
        };
        createNotification(
          `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
          newNotification
        );

        const action = setIsLoadingNotification();
        dispatch(action);
      } else if (info.file.status === "error") {
        openNotification(
          "error",
          `${tNotification("ProfilePage.UpdateAvatarError.title")}`,
          `${tNotification("ProfilePage.UpdateAvatarError.content")}`
        );
      }
    },
  };

  const showPropsConfirm = (): void => {
    confirm({
      title: `${tProfilePage("ConfirmLogout.title")}`,
      icon: <ExclamationCircleFilled />,
      content: `${tProfilePage("ConfirmLogout.content")}`,
      okText: `${tProfilePage("ConfirmLogout.okText")}`,
      okType: "danger",
      cancelText: `${tProfilePage("ConfirmLogout.cancelText")}`,
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk() {
        openNotification(
          "success",
          `${tNotification("ProfilePage.LogoutSuccess.title")}`,
          `${tNotification("ProfilePage.LogoutSuccess.content")}`
        );
        deleteCookie("accessToken");
        deleteCookie("i_d");
        setIsLoading(!isLoading);

        const action = resetProfile();
        dispatch(action);
      },
    });
  };

  useEffect(() => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin === true) {
      const getTokent: string | null = getCookie("accessToken");
      getProfile();

      if (getTokent) {
        setToken(getTokent);
      }

      const id: string | null = getCookie("i_d");
      const action = getBookingUserAsync(Number(id));
      dispatch(action);
      setIsMounted(true);
    }
  }, [isLoading]);

  useEffect(() => {
    const isLogin: boolean | undefined = checkIsLogin();

    if (isLogin !== true) {
      router.push(`/${locale}`);
    }
  }, [profile]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            fontWeightStrong: 600,
            itemColor: "#6a6a6a",
          },
          Image: {},
        },
      }}
    >
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[35%] xl:w-[30%] xl:px-5">
          <div
            className="w-full rounded-2xl px-6 py-8"
            style={{
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full border !relative">
                {isMounted && profile && (
                  <div className="overflow-hidden w-[100px] h-[100px] md:w-[200px] md:h-[200px] rounded-full">
                    {profile.avatar === "" ? (
                      <Image
                        className="!w-[100px] !h-[100px] md:!w-[200px] md:!h-[200px] rounded-full object-cover"
                        src="/images/logo.jpg"
                        alt="image"
                      />
                    ) : (
                      <Image
                        className="!w-[100px] !h-[100px] md:!w-[200px] md:!h-[200px] rounded-full object-cover"
                        src={profile.avatar}
                        alt="image"
                      />
                    )}
                  </div>
                )}

                <Upload {...props}>
                  <div className="!absolute !bottom-[-10px] !left-0 !right-0 flex items-center justify-center">
                    <Button
                      className="!rounded-full !border-none !px-5 !font-bold !text-custome-gray-200 group transition-all duration-500 ease-in-out hover:!text-primary-100"
                      style={{
                        boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                      }}
                    >
                      <FontAwesomeIcon
                        size="lg"
                        className="transition-all duration-500 ease-in-out text-custome-gray-200 group-hover:!text-primary-100"
                        icon={faCamera}
                      />
                      {tProfilePage("titleUpdateAvatar")}
                    </Button>
                  </div>
                </Upload>
              </div>
            </div>
            {/* Thong tin */}
            <hr className="mt-10 mb-5" />

            <div>
              <h1 className="font-bold text-lg">
                {tProfilePage("titleProfile")}
              </h1>

              {isMounted && profile && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                      size="lg"
                      icon={faUserTag}
                      style={{ color: "#6a6a6a" }}
                    />
                    <p className="text-custome-gray-200">
                      {profile && profile.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ color: "#6a6a6a" }}
                      size="lg"
                    />
                    <p className="text-custome-gray-200">
                      {profile && profile.email}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{ color: "#6a6a6a" }}
                      size="lg"
                    />
                    <p className="text-custome-gray-200">
                      {profile && profile.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon
                      icon={faCakeCandles}
                      style={{ color: "#6a6a6a" }}
                      size="lg"
                    />
                    <p className="text-custome-gray-200">
                      {formatDate(profile && profile.birthday)}
                    </p>
                  </div>
                </div>
              )}

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
                  {tProfilePage("titleUpdateButton")}
                </button>
                <button
                  onClick={() => {
                    showPropsConfirm();
                  }}
                  className="text-custome-gray-200 font-bold w-full py-2 rounded-full transition-all duration-500 ease-in-out shadow-sm hover:shadow-lg hover:text-primary-100 mt-3 block lg:hidden"
                  style={{
                    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                  }}
                >
                  {tProfilePage("titleButtonLogout")}
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
                label: `${tProfilePage("Tabs.titleTab1")}`,
                icon: <FontAwesomeIcon size="lg" icon={faClockRotateLeft} />,
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
                label: `${tProfilePage("Tabs.titleTab2")}`,
                icon: <FontAwesomeIcon size="lg" icon={faHeart} />,
                children: <FavouriteRoom />,
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
