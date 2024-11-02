"use client";

import { getRoomDetailAsync } from "@/services/room-detail/roomDetail.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { RoomType } from "@/types/room/roomType.type";
import {
  calculateDaysBetween,
  convertUSDToVND,
  formatDate,
  getCookie,
  getCurrentDateTime,
  getFormattedDateTime,
  isDateInPast,
  toSlugWithId,
  truncateString,
} from "@/utils/method/method";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarXmark,
  faInfo,
  faPenToSquare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Modal, Tooltip } from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { deleteBookingAsync } from "@/services/delete-booking/deleteBooking.service";
import { ReqType } from "@/types/req/reqType.type";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { ExclamationCircleFilled } from "@ant-design/icons";
import ModalUpdateBooking from "@/components/modal-update-booking/ModalUpdateBooking";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalRating from "@/components/modal-rating/ModalRating";
import { NotifiType } from "@/types/notifi/notifi.type";
import { setIsLoadingNotification } from "@/app/globalRedux/features/statusAppSlice";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";

const { Meta } = Card;
const { confirm } = Modal;

type Props = {
  booking: BookingType;
};

const ProfileCard: React.FC<Props> = ({ booking }) => {
  const dispatch: AppDispatch = useDispatch();
  const router: AppRouterInstance = useRouter();
  const [roomDetail, setRoomDetail] = useState<RoomType>();
  const { openNotification } = useNotification();
  const [isRating, setIsRating] = useState<boolean>(false);
  const [isModalUpdateBookingOpen, setIsModalUpdateBookingOpen] =
    useState<boolean>(false);
  const [isModalViewRatingOpen, setIsModalViewRatingOpen] =
    useState<boolean>(false);
  const { profile } = useSelector((state: RootState) => state.user);
  const { createNotification } = useNotifiCustome();

  const getRoomDetail = async (): Promise<void> => {
    const data: RoomType = await getRoomDetailAsync(Number(booking.maPhong));
    setRoomDetail(data);
  };

  const handleDeleteBooking = async (id: number) => {
    confirm({
      title: "Huỷ lịch đặt phòng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn huỷ lịch đặt phòng này?",
      okText: "Huỷ lịch",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res: ReqType<string> = await deleteBookingAsync(id);
        switch (res.statusCode) {
          case 200:
            const id: string | null = getCookie("i_d");
            const action = getBookingUserAsync(Number(id));
            dispatch(action);
            openNotification("success", "Huỷ lịch đặt phòng", `${res.message}`);

            const newNotification: NotifiType = {
              id: `Bk${getFormattedDateTime()}`,
              title: "Đặt phòng",
              content: "Huỷ lịch đặt phòng thành công",
              date: `${getCurrentDateTime()}`,
              type: "success",
            };
            createNotification(
              `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
              newNotification
            );

            const actions = setIsLoadingNotification();
            dispatch(actions);
            break;
          default:
            openNotification("error", "Huỷ lịch đặt phòng", `${res.content}`);

            const newNotificationEr: NotifiType = {
              id: `Bk${getFormattedDateTime()}`,
              title: "Đặt phòng",
              content: "Huỷ lịch đặt phòng không thành công",
              date: `${getCurrentDateTime()}`,
              type: "success",
            };
            createNotification(
              `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
              newNotificationEr
            );

            const actionEr = setIsLoadingNotification();
            dispatch(actionEr);
            break;
        }
      },
    });
  };

  const total = (): string => {
    let total: number = 0;
    if (roomDetail) {
      const countDate: number = calculateDaysBetween(
        booking.ngayDen,
        booking.ngayDi
      );
      const roomPrice: number = roomDetail.giaTien;
      const member: number = booking.soLuongKhach;

      total = roomPrice * countDate + member * 1;
    }
    return convertUSDToVND(total);
  };

  const getRatingRoom = (): void => {
    const ratingBooking: number[] = JSON.parse(
      localStorage.getItem("ratingList") || "[]"
    );

    const rating = ratingBooking.includes(booking.id);

    if (rating) {
      setIsRating(true);
    } else {
      setIsRating(false);
    }
  };

  useEffect(() => {
    getRoomDetail();
    getRatingRoom();
  }, []);

  return (
    <>
      {roomDetail && (
        <Card
          className="mb-5 !w-full md:!w-[calc((100%-12px)/2)] lg:!w-[calc((100%-24px)/3)] transition-all duration-500 ease-in-out hover:shadow-md"
          style={{ width: "calc((100% - 24px)/3)" }}
          cover={
            <img
              alt="example"
              src={roomDetail.hinhAnh}
              className="w-full h-[150px] object-cover"
            />
          }
          actions={[
            <>
              {isDateInPast(booking.ngayDi) ? (
                <Tooltip title="Đánh giá phòng">
                  <Button
                    onClick={() => {
                      setIsModalViewRatingOpen(true);
                    }}
                    disabled={isRating}
                    className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !p-0 !px-3 !h-[20px] focus-visible:outline-none group"
                  >
                    <FontAwesomeIcon
                      className={`transition-all duration-500 ease-in-out  ${
                        isRating
                          ? "text-[#cfcece]"
                          : "text-custome-gray-200 group-hover:text-primary-100"
                      }`}
                      size="lg"
                      icon={faStar}
                    />
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title="Huỷ đặt phòng">
                  <Button
                    onClick={() => {
                      handleDeleteBooking(booking.id);
                    }}
                    disabled={isDateInPast(booking.ngayDen)}
                    className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !p-0 !px-3 !h-[20px] focus-visible:outline-none group"
                  >
                    <FontAwesomeIcon
                      className={`transition-all duration-500 ease-in-out  ${
                        isDateInPast(booking.ngayDen)
                          ? "text-[#cfcece]"
                          : "text-custome-gray-200 group-hover:text-primary-100"
                      }`}
                      size="lg"
                      icon={faCalendarXmark}
                    />
                  </Button>
                </Tooltip>
              )}
            </>,
            <>
              {isDateInPast(booking.ngayDi) === false && (
                <Tooltip title="Sửa lịch đặt phòng">
                  <Button
                    onClick={() => {
                      setIsModalUpdateBookingOpen(true);
                    }}
                    disabled={isDateInPast(booking.ngayDen)}
                    className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !p-0 !px-3 !h-[20px] focus-visible:outline-none group"
                  >
                    <FontAwesomeIcon
                      className={`transition-all duration-500 ease-in-out  ${
                        isDateInPast(booking.ngayDen)
                          ? "text-[#cfcece]"
                          : "text-custome-gray-200 group-hover:text-primary-100"
                      }`}
                      size="lg"
                      icon={faPenToSquare}
                    />
                  </Button>
                </Tooltip>
              )}
            </>,
            <Tooltip title="Xem chi tiết phòng">
              <Button
                className="!border-none !shadow-none !bg-transparent transition-all duration-500 ease-in-out hover:tex bg-primary-100 !py-0 !px-3 !h-[20px] focus-visible:outline-none group"
                onClick={() => {
                  router.push(
                    `/room/${toSlugWithId(roomDetail.tenPhong, roomDetail.id)}`
                  );
                }}
              >
                <FontAwesomeIcon
                  className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
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
                <Tooltip title={roomDetail.tenPhong}>
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
                    <p className="font-normal">{formatDate(booking.ngayDi)}</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Số người:</h3>
                    <p className="font-normal">{booking.soLuongKhach}</p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Giá phòng:</h3>
                    <p className="font-normal">
                      {convertUSDToVND(roomDetail.giaTien)}/đêm
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-custome-gray-200 text-sm">
                    <h3 className="font-bold">Tổng tiền:</h3>
                    <p className="font-normal">{total()}</p>
                  </div>
                </div>
              </>
            }
            description={<div></div>}
          />
        </Card>
      )}

      <ModalUpdateBooking
        roomDetail={roomDetail}
        booking={booking}
        isModalUpdateBookingOpen={isModalUpdateBookingOpen}
        setIsModalUpdateBookingOpen={setIsModalUpdateBookingOpen}
      />
      <ModalRating
        isRating={isRating}
        setIsRating={setIsRating}
        booking={booking}
        isModalViewRatingOpen={isModalViewRatingOpen}
        setIsModalViewRatingOpen={setIsModalViewRatingOpen}
      />
    </>
  );
};

export default ProfileCard;
