import RoomItem from "@/components/room-item/RoomItem";
import { getRoomsLocation } from "@/services/rooms-location/roomsLocation.service";
import { RoomType } from "@/types/room/roomType.type";
import React from "react";

type Props = {
  searchParams: {
    keyword: string;
  };
};

const Search: React.FC<Props> = async ({ searchParams }) => {
  const value = searchParams.keyword || "";

  const data: RoomType[] = await getRoomsLocation(value);

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((room: RoomType, index: number) => (
        <RoomItem key={index} data={room} />
      ))}
    </div>
  );
};

export default Search;
