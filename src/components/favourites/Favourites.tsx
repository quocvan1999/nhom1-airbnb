"use client";

import useNotification from "@/custome-hook/useNotification/useNotification";
import { RoomType } from "@/types/room/roomType.type";
import { faHeart, faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Pagination, Tooltip } from "antd";
import Meta from "antd/es/card/Meta";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {
  rooms: RoomType[];
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const Favourites: React.FC<Props> = ({ rooms, isLoading, setIsLoading }) => {
  const router: AppRouterInstance = useRouter();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { openNotification } = useNotification();

  const paginatedData = rooms
    .slice()
    .reverse()
    .slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

  const unlikeRoom = (roomId: number): void => {
    const listLikeRoom: number[] = JSON.parse(
      localStorage.getItem(`${process.env.NEXT_PUBLIC_NAME_STORAGE}`) || "[]"
    );

    const updatedArray = listLikeRoom.filter((id) => id !== roomId);

    if (updatedArray) {
      localStorage.setItem(
        `${process.env.NEXT_PUBLIC_NAME_STORAGE}`,
        JSON.stringify(updatedArray)
      );
      openNotification(
        "success",
        "Yêu thích",
        "Xoá phòng khỏi mục yêu thích thành công"
      );
      setIsLoading(!isLoading);
    }
  };

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
          paginatedData.map((item: RoomType, index: number) => (
            <Card
              className="mb-5 transition-all duration-500 ease-in-out hover:shadow-md"
              style={{ width: "calc((100% - 24px)/3)" }}
              key={index}
              cover={
                <img
                  alt="example"
                  src={item.hinhAnh}
                  className="w-full h-[150px] object-cover"
                />
              }
              actions={[
                <Tooltip title="Bỏ yêu thích">
                  <Button
                    onClick={() => {
                      unlikeRoom(item.id);
                    }}
                    className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !p-0 !px-3 !h-[20px] focus-visible:outline-none"
                  >
                    <FontAwesomeIcon
                      className="text-primary-100"
                      size="lg"
                      icon={faHeart}
                    />
                  </Button>
                </Tooltip>,
                <Tooltip title="Xem chi tiết phòng">
                  <Button
                    className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !py-0 !px-3 !h-[20px] focus-visible:outline-none"
                    onClick={() => {
                      router.push(`/room/${item.id}`);
                    }}
                  >
                    <FontAwesomeIcon
                      className="text-custome-gray-200"
                      size="lg"
                      icon={faInfo}
                    />
                  </Button>
                </Tooltip>,
              ]}
            >
              <Meta
                title={
                  <>
                    <Tooltip title={item.tenPhong}>
                      <span>{item.tenPhong}</span>
                    </Tooltip>
                    <hr className="w-[30px] mt-4 mb-2" />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                        <p className="font-normal">${item.giaTien}</p>
                      </div>
                    </div>
                  </>
                }
                description={<div></div>}
              />
            </Card>
          ))}
      </div>
      {rooms.length >= 10 && (
        <div className="mt-5">
          <Pagination
            align="end"
            current={pageIndex}
            defaultPageSize={pageSize}
            total={rooms.length}
            onChange={handleChangePageIndex}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
          />
        </div>
      )}
    </>
  );
};

export default Favourites;
