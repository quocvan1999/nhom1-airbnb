"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalUpdateUser from "@/components/modal-update-user/ModalUpdateUser";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { formatDate, getCookie } from "@/utils/method/method";
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
import React, { useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState<boolean>(false);

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
              "Ảnh đại diện",
              "Vui lòng chọn file có định dạng (jpg, jpeg, png, gif)"
            );
            return;
          }

          const maxSizeInBytes = 1 * 1024 * 1024;
          if (file.size > maxSizeInBytes) {
            reject();
            isPass = false;
            openNotification(
              "error",
              "Ảnh đại diện",
              "Dung lượng hình phải dưới 1M"
            );
            return;
          }

          if (isPass) {
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
          }
        }
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
      router.push("/");
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
                    <Image
                      className="!w-[100px] !h-[100px] md:!w-[200px] md:!h-[200px] rounded-full object-cover"
                      src={profile.avatar}
                      alt="image"
                    />
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
                label: "Phòng yêu thích",
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
