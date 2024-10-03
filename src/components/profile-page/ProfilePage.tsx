"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalUpdateUser from "@/components/modal-update-user/ModalUpdateUser";
import BookingsProfile from "@/components/bookings-profile/BookingsProfile";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { getCookie } from "@/utils/method/method";
import { Button, Empty, Upload, UploadProps } from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

  const props: UploadProps = {
    name: "formFile",
    action: "https://airbnbnew.cybersoft.edu.vn/api/users/upload-avatar",
    headers: {
      tokenCybersoft: process.env.NEXT_PUBLIC_CYBERSOFT_TOKEN || "",
      token: token,
    },
    showUploadList: false,
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
    <div className="w-full flex">
      <div className="w-[30%] px-10 ">
        <div className="border w-full shadow-md rounded-2xl px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-[100px] h-[100px] rounded-full border"
              style={{
                backgroundImage: `url("${profile.avatar}")`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <Upload {...props}>
              <Button className="!border-none !shadow-none !outline-none underline hover:!text-black">
                Cập nhật ảnh
              </Button>
            </Upload>
          </div>
          <div className="flex flex-col gap-2 border-b pb-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ fill: "#222" }}
            >
              <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z"></path>
              <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z"></path>
            </svg>
            <h3 className="font-bold">Xác minh danh tính</h3>
            <p className="text-custome-gray-200">
              Xác thực danh tính của bạn với huy hiệu xác minh danh tính
            </p>
            <button className="border rounded-lg px-3 py-2 inline-block">
              Nhận huy hiệu
            </button>
          </div>
          <div className="py-10">
            <h3 className="font-bold">
              <span className="capitalize">{profile && profile.name}</span> đã
              xác nhận
            </h3>
            <p className="flex gap-1 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style={{ fill: "#222" }}
              >
                <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z"></path>
              </svg>
              <span className="text-custome-gray-200">Địa chỉ email</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-[70%]">
        <h1 className="text-xl font-bold capitalize">
          Xin chào, tôi là {profile.name}
        </h1>
        <p className="text-custome-gray-200 text-sm">
          Bắt đầu tham gia vào 2024
        </p>
        <ModalUpdateUser />

        <div className="mt-5">
          <h1 className="font-bold text-xl px-2">Phòng đã thuê</h1>
          <div className="mt-5">
            {bookings.length > 0 ? (
              <BookingsProfile data={bookings} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
