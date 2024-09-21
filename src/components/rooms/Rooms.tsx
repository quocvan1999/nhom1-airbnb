import RoomItem from "@/components/room-item/RoomItem";
import { getRoomsAsync } from "@/services/rooms/rooms.service";
import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";
import React from "react";

type Props = {};

const Rooms: React.FC<Props> = async ({}) => {
  const res: reqPaginationType<RoomType[]> = await getRoomsAsync(1, 10);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {res.data.map((room: RoomType, index: number) => (
          <RoomItem key={index} data={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
