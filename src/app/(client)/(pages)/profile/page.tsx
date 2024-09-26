"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ProfileCard from "@/components/profile-card/ProfileCard";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { getCookie } from "@/utils/method/method";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

const Profile: React.FC<Props> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const { profile, bookings } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const isLogin = checkIsLogin();

    if (isLogin !== true) {
      router.push("/auth/login");
    } else {
      getProfile();

      const id = getCookie("i_d");
      const action = getBookingUserAsync(Number(id));
      dispatch(action);
    }
  }, []);

  return (
    <div className="w-full flex">
      <div className="w-[30%] px-10 ">
        <div className="border w-full shadow-md rounded-2xl px-6 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-[100px] h-[100px] rounded-full border"></div>
            <button className="border px-3 py-1 rounded-lg bg-primary-100 text-white">
              Cập nhật ảnh
            </button>
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
        <button className="border rounded-lg px-3 py-2 inline-block mt-5">
          Chỉnh sửa hồ sơ
        </button>

        <div className="mt-5">
          <h1 className="font-bold text-xl px-2">Phòng đã thuê</h1>

          <div className="">
            {bookings &&
              bookings.map((booking: BookingType, index: number) => (
                <ProfileCard key={index} id={booking.maPhong} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
