"use client";

import { reqPaginationType } from "@/types/req-pagination/reqPaginationType.type";
import { RoomType } from "@/types/room/roomType.type";
import { Pagination } from "antd";
import { useLocale } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  data: reqPaginationType<RoomType[]>;
};

const PaginationRooms: React.FC<Props> = ({ data }) => {
  const locale = useLocale();
  const router: AppRouterInstance = useRouter();

  const handleChangePageIndex = (page: number, pageSize: number): void => {
    router.push(`/${locale}/?page=${page}&size=${pageSize}`);
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
      itemRender={(page, type, originalElement) => {
        if (type === "page") {
          return (
            <Link href={`/${locale}/?page=${page}&size=${data.pageSize}`}>
              {page}
            </Link>
          );
        }
        return originalElement;
      }}
    />
  );
};

export default PaginationRooms;
