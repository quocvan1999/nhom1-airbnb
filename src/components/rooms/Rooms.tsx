import React from "react";
import PaginationRooms from "@/components/pagination-rooms/PaginationRooms";
import RoomItem from "@/components/room-item/RoomItem";
import { getRoomsAsync } from "@/services/rooms/rooms.service";
import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";

type Props = {
  page: string | number;
  size: string | number;
};

const Rooms: React.FC<Props> = async ({ page, size }) => {
  const res: reqPaginationType<RoomType[]> = await getRoomsAsync(page, size);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {res.data.map((room: RoomType, index: number) => (
          <RoomItem key={index} data={room} />
        ))}
      </div>
      <PaginationRooms data={res} />
    </div>
  );
};

export default Rooms;
