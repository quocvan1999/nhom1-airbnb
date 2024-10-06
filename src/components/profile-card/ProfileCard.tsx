"use client";

import { getRoomDetailAsync } from "@/services/room-detail/roomDetail.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { RoomType } from "@/types/room/roomType.type";
import { truncateString } from "@/utils/method/method";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  id: number | undefined;
};

const ProfileCard: React.FC<Props> = ({ id }) => {
  const [roomDetail, setRoomDetail] = useState<RoomType>();

  const getRoomDetail = async (): Promise<void> => {
    const data: RoomType = await getRoomDetailAsync(Number(id));
    setRoomDetail(data);
  };

  useEffect(() => {
    getRoomDetail();
  }, []);

  return (
    <>
      {roomDetail && (
        <Link
          href={`/room/${roomDetail.id}`}
          className="flex flex-col md:flex-row md:h-[200px] md:gap-3 items-center py-5 border-b cursor-pointer"
        >
          <div className="w-full h-[200px] md:w-[35%] md:h-full">
            <img
              src={roomDetail.hinhAnh}
              alt="image"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          <div className="w-full h-full flex md:w-[65%] flex-col justify-between">
            <div>
              <p className="text-custome-gray-200">
                Toàn bộ căn hộ dịch vụ tại Bình Thạnh
              </p>
              <h1 className="text-[18px] font-medium text-custome-black-100">
                {truncateString(roomDetail.tenPhong, 100)}
              </h1>
              <hr className="w-[30px] my-3" />
              <p className="text-custome-gray-200">
                2 khách - phòng studio - 1 giường - 1 phòng tắm
              </p>
              <p className="text-custome-gray-200">
                Wifi - Bếp - Điều hoà nhiệt độ - Máy giặt
              </p>
            </div>
            <div className="text-end">
              <p className="text-custome-black-100 font-bold">
                ${roomDetail.giaTien}/<span className="font-normal">tháng</span>
              </p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ProfileCard;
