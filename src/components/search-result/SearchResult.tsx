"use client";

import SearchCard from "@/components/search-card/SearchCard";
import { RoomType } from "@/types/room/roomType.type";
import { Empty, Pagination } from "antd";
import React, { useState } from "react";

type Props = {
  data: RoomType[];
};

const SearchResult: React.FC<Props> = ({ data }) => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const paginatedData = data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  const handleChangePageIndex = (page: number) => {
    setPageIndex(page);
  };

  const handlePageSizeChange  = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <>
      {data.length > 0 ? (
        <div>
          <div className="flex flex-col gap-4">
            {paginatedData &&
              paginatedData.map((item: RoomType, index: number) => (
                <SearchCard key={index} item={item} />
              ))}
          </div>

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
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
};

export default SearchResult;
