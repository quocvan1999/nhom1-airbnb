"use client";

import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";
import { getRoomDetailAsync } from "@/services/room-detail/roomDetail.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import { formatDate, truncateString } from "@/utils/method/method";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
import React, { useEffect, useState } from "react";

const { Meta } = Card;

type Props = {
  booking: BookingType;
};

const ProfileCard: React.FC<Props> = ({ booking }) => {
  const [roomDetail, setRoomDetail] = useState<RoomType>();

  const getRoomDetail = async (): Promise<void> => {
    const data: RoomType = await getRoomDetailAsync(Number(booking.maPhong));
    setRoomDetail(data);
  };

  useEffect(() => {
    getRoomDetail();
  }, []);

  return (
    <>
      {roomDetail && (
        <Card
          className="mb-5"
          style={{ width: "calc((100% - 24px)/3)" }}
          cover={<img alt="example" src={roomDetail.hinhAnh} />}
          actions={[
            <DeleteOutlined key="delete" />,
            <EditOutlined key="edit" />,
            <EyeOutlined key="view" />,
          ]}
        >
          <Meta
            title={
              <>
                <Tooltip title={truncateString(roomDetail.tenPhong, 50)}>
                  <span>{roomDetail.tenPhong}</span>
                </Tooltip>
                <hr className="w-[30px] mt-4 mb-2" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Ngày đến:</h3>
                    <p className="font-normal">{formatDate(booking.ngayDen)}</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Ngày đi:</h3>
                    <p className="font-normal">{formatDate(booking.ngayDen)}</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Số người:</h3>
                    <p className="font-normal">{booking.soLuongKhach}</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Giá phòng:</h3>
                    <p className="font-normal">{roomDetail.giaTien}$</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Tổng tiền:</h3>
                    <p className="font-normal">
                      {Number(booking.soLuongKhach) *
                        Number(roomDetail.giaTien)}
                      $
                    </p>
                  </div>
                </div>
              </>
            }
            description={<div></div>}
          />
        </Card>
      )}
    </>
  );
};

export default ProfileCard;
