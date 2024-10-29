import Map from "@/components/map/Map";
import SearchResult from "@/components/search-result/SearchResult";
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

export const generateMetadata = async ({ searchParams }: Props) => {
  const value: string = searchParams.keyword || "";
  const data: RoomType[] = await getRoomsLocation(value);

  return {
    title: `Tìm kiếm chỗ ở cho từ khóa: ${value}`,
    description: `Tìm thấy hơn ${data.length} chỗ ở cho từ khóa "${value}".`,
    keywords: `${value}, chỗ ở, tìm kiếm chỗ ở, ${tagData.join(", ")}`,
    openGraph: {
      title: `Tìm kiếm chỗ ở cho từ khóa: ${value}`,
      description: `Tìm thấy hơn ${data.length} chỗ ở cho từ khóa "${value}".`,
      url: `https://nhom1-airbnb.vercel.app/search?keyword=${value}`,
      images: [
        {
          url: "https://a0.muscache.com/im/pictures/miso/Hosting-694055224756906854/original/76f85a0c-b3e2-4f1d-9aa9-d7838f2393c6.jpeg?im_w=960&im_q=highq",
        },
      ],
    },
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
      description:
        "Tìm kiếm cho thuê kỳ nghỉ, nhà gỗ, nhà bãi biển, nhà độc đáo và những trải nghiệm trên toàn cầu trên Airbnb.",
      url: "https://nhom1-airbnb.vercel.app",
    },
  };
};

const Search: React.FC<Props> = async ({ searchParams }) => {
  const value: string = searchParams.keyword || "";
  const data: RoomType[] = await getRoomsLocation(value);

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full md:w-[60%]">
            <p>{`Hơn ${data.length} chỗ ở - ${getCurrentDate()}`}</p>
            <div className="flex flex-col">
              <SearchResult keyword={value} data={data} />
            </div>
          </div>
          <div className="w-full mt-5 md:mt-0 md:w-[40%]">
            <Map keyword={value} />
          </div>
        </div>
      ) : (
        <div className="w-full h-[150px] flex items-center justify-center">
          <h1 className="text-custome-gray-200">Không có dữ liệu</h1>
        </div>
      )}
    </>
  );
};

export default Search;
