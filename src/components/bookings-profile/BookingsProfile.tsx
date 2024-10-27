"use client";

import ProfileCard from "@/components/profile-card/ProfileCard";
import { BookingType } from "@/types/booking/bookingType.type";
import { Pagination } from "antd";
import React, { useState } from "react";

type Props = {
  data: BookingType[];
};

const BookingsProfile: React.FC<Props> = ({ data }) => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const paginatedData = data
    .slice()
    .reverse()
    .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const handleChangePageIndex = (page: number) => {
    setPageIndex(page);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPageSize(size);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {paginatedData &&
          paginatedData.map((item: BookingType, index: number) => (
            <ProfileCard booking={item} key={index} />
          ))}
      </div>
      {data.length >= 10 && (
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
    </>
  );
};

export default BookingsProfile;
