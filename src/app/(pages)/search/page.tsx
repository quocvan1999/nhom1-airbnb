import Map from "@/components/map/Map";
import SearchCard from "@/components/search-card/SearchCard";
import TitleH1 from "@/components/titleH1/TitleH1";
import { getRoomsLocation } from "@/services/rooms-location/roomsLocation.service";
import { RoomType } from "@/types/room/roomType.type";
import { getCurrentDate } from "@/utils/method/method";
import { tagData } from "@/utils/tag-data/tag.data";
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
    <>
      {data.length > 0 && (
        <div className="flex gap-3">
          <div className="w-[60%]">
            <p>{`Hơn ${data.length} chỗ ở - ${getCurrentDate()}`}</p>
            <TitleH1 title="Chỗ ở tại khu vực đã chọn" />
            <div className="flex gap-3">
              {tagData.map((item: string, index: number) => (
                <div key={index} className="border px-5 py-2 rounded-full">
                  {item}
                </div>
              ))}
            </div>
            <hr className="my-5" />
            <div className="flex flex-col">
              {data.map((item: RoomType, index: number) => (
                <SearchCard key={index} item={item} />
              ))}
            </div>
          </div>
          <div className="w-[40%]">
            <Map />
          </div>
        </div>
      )}
    </>
  );
};

export default Search;
