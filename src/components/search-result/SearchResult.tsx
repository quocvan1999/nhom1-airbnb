"use client";

import SearchCard from "@/components/search-card/SearchCard";
import TitleH1 from "@/components/titleH1/TitleH1";
import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import { Empty, Pagination } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

type Props = {
  data: RoomType[];
  keyword: string | number;
};

const SearchResult: React.FC<Props> = ({ data, keyword }) => {
  const tSearchPage = useTranslations("SearchPage");
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [location, setLocation] = useState<LocationType | null>(null);

  const paginatedData = data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  const handleChangePageIndex = (page: number) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  const getLocation = async (): Promise<void> => {
    const res: ReqType<LocationType> = await getLocationIdAsync(
      Number(keyword)
    );

    if (typeof res.content === "object") {
      setLocation(res.content);
    }
  };

  useEffect(() => {
    if (keyword) {
      getLocation();
    }
  }, [keyword]);

  return (
    <>
      <TitleH1
        title={`${tSearchPage("SearchResult.title")} ${location?.tenViTri}`}
      />
      <hr className="my-5" />
      {data.length > 0 ? (
        <div>
          <div className="flex flex-col gap-4">
            {paginatedData &&
              paginatedData.map((item: RoomType, index: number) => (
                <SearchCard key={index} item={item} />
              ))}
          </div>

          {paginatedData && paginatedData.length > 10 && (
            <div className="mt-5">
              <Pagination
                align="end"
                current={pageIndex}
                defaultPageSize={pageSize}
                total={data.length}
                onChange={handleChangePageIndex}
                onShowSizeChange={handlePageSizeChange}
                showSizeChanger
              />
            </div>
          )}
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default SearchResult;
