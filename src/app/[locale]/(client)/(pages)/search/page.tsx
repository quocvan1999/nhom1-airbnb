import Map from "@/components/map/Map";
import SearchResult from "@/components/search-result/SearchResult";
import { getRoomsLocation } from "@/services/rooms-location/roomsLocation.service";
import { RoomType } from "@/types/room/roomType.type";
import { extractId, getCurrentDate } from "@/utils/method/method";
import { tagData } from "@/utils/tag-data/tag.data";
import React from "react";

type Props = {
  searchParams: {
    vitri: string;
  };
  params: {
    locale: string;
  };
};

export const generateMetadata = async ({ searchParams, params }: Props) => {
  const { locale } = params;
  const id: number | null = extractId(searchParams.vitri);
  const data: RoomType[] = await getRoomsLocation(Number(id));

  return {
    title: `Tìm kiếm chỗ ở cho từ khóa: ${searchParams.vitri}`,
    description: `Tìm thấy hơn ${data.length} chỗ ở cho từ khóa "${searchParams.vitri}".`,
    keywords: `${searchParams.vitri}, chỗ ở, tìm kiếm chỗ ở, ${tagData.join(
      ", "
    )}`,
    openGraph: {
      title: `Tìm kiếm chỗ ở cho từ khóa: ${searchParams.vitri}`,
      description: `Tìm thấy hơn ${data.length} chỗ ở cho từ khóa "${searchParams.vitri}".`,
      url: `https://nhom1-airbnb.vercel.app/${locale}/search?keyword=${searchParams.vitri}`,
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
      url: `https://nhom1-airbnb.vercel.app/${locale}`,
    },
  };
};

const Search: React.FC<Props> = async ({ searchParams }) => {
  const id: number | null = extractId(searchParams.vitri);
  const data: RoomType[] = await getRoomsLocation(Number(id));

  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-[60%]">
            <p>{`Hơn ${data.length} chỗ ở - ${getCurrentDate()}`}</p>
            <div className="flex flex-col">
              <SearchResult keyword={Number(id)} data={data} />
            </div>
          </div>
          <div className="w-full mt-5 lg:mt-0 lg:w-[40%]">
            <Map keyword={Number(id)} />
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
