"use client";

import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";
import { Pagination } from "antd";
import React from "react";

type Props = {
  data: reqPaginationType<RoomType[]>;
};

const PaginationRooms: React.FC<Props> = ({ data }) => {
  const handleChangePageIndex: (page: number, pageSize: number) => void = (
    page,
    pageSize
  ) => {
    console.log(page, pageSize);
  };
  return (
    <Pagination
      align="end"
      defaultCurrent={1}
      current={data.pageIndex}
      defaultPageSize={10}
      pageSize={data.pageSize}
      total={data.totalRow}
      onChange={handleChangePageIndex}
    />
  );
};

export default PaginationRooms;
