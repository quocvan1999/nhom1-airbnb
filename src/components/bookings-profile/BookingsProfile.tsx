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

  return (
    <>
      {paginatedData &&
        paginatedData.map((item: BookingType, index: number) => (
          <ProfileCard id={item.maPhong} key={index} />
        ))}
      <Pagination
        align="end"
        current={pageIndex}
        defaultPageSize={pageSize}
        total={data.length}
        onChange={handleChangePageIndex}
        onShowSizeChange={handlePageSizeChange}
        showSizeChanger
      />
    </>
  );
};

export default BookingsProfile;
