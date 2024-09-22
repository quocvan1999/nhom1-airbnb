import { RoomType } from "@/types/room/roomType.type";
import { truncateString } from "@/utils/method/method";
import React from "react";

type Props = {
  data: RoomType;
};

const RoomItem: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-[calc((100%-36px)/4)] cursor-pointer">
      <img
        src={data.hinhAnh}
        alt="hinh anh"
        className="w-full h-[270px] object-cover rounded-2xl"
      />
      <div className="mt-3">
        <h1 className="text-custome-black-100 font-bold">
          {truncateString(data.tenPhong, 30)}
        </h1>
        <p className="mt-1 text-custome-gray-200">
          {truncateString(data.moTa, 60)}
        </p>
        <p className="text-custome-black-100 font-bold">{data.giaTien}$</p>
      </div>
    </div>
  );
};

export default RoomItem;
