import { RoomType } from "@/types/room/roomType.type";
import { truncateString } from "@/utils/method/method";
import Link from "next/link";
import React from "react";

type Props = {
  item: RoomType;
};

const SearchCard: React.FC<Props> = ({ item }) => {
  return (
    <Link
      href={`/room/${item.id}`}
      className="flex flex-col md:flex-row md:h-[200px] md:gap-3 items-center py-5 border-b cursor-pointer"
    >
      <div className="w-full h-[200px] md:w-[35%] md:h-full">
        <img
          src={item.hinhAnh}
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
            {truncateString(item.tenPhong, 100)}
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
            ${item.giaTien}/<span className="font-normal">tháng</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SearchCard;
