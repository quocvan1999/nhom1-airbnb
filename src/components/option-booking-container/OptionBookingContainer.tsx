"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalCustomer from "@/components/modal-customer/ModalCustomer";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { bookingAsync } from "@/services/booking/booking.service";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { RoomType } from "@/types/room/roomType.type";
import { calculateDaysBetween } from "@/utils/method/method";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Dropdown,
  Input,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";

const { confirm } = Modal;

type Props = {
  data: RoomType;
};

const OptionBookingContainer: React.FC<Props> = ({ data }) => {
  const dispatch: AppDispatch = useDispatch();
  const [countMember, setCountMember] = useState<number>(1);
  const [countDate, setCountDate] = useState<number>(0);
  const [dateCheckin, setDateCheckin] = useState<string>("");
  const [dateCheckout, setDateCheckout] = useState<string>("");
  const [listDate, setListDate] = useState<dayjs.Dayjs[]>([]);
  const { profile } = useSelector((state: RootState) => state.user);
  const { bookings } = useSelector((state: RootState) => state.room);
  const [commentCount, setCommentCount] = useState<number>(0);
  const { comments } = useSelector((state: RootState) => state.room);
  const { openNotification } = useNotification();
  const { checkIsLogin } = useCheckLogin();

  const getCommentToRoom = async (): Promise<void> => {
    const action = getCommentToRoomAsync(data.id);
    dispatch(action);
  };

  const setRatingRoom = (): number => {
    let rating: number = 0;
    if (commentCount) {
      if (commentCount >= 7) {
        rating = 5;
      } else if (commentCount < 0) {
        rating = 0;
      } else {
        const ratings = (commentCount / 7) * 5;
        rating = Math.round(ratings);
      }
    }

    return rating;
  };

  const showPropsConfirm = (): void => {
    confirm({
      title: "Đặt phòng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn đặt phòng này",
      okText: "Đặt phòng",
      okType: "danger",
      cancelText: "Huỷ",
      onCancel() {},
      onOk: async () => {
        const value: BookingType = {
          id: 0,
          maNguoiDung: profile.id,
          maPhong: data.id,
          ngayDen: dateCheckin,
          ngayDi: dateCheckout,
          soLuongKhach: countMember,
        };

        const res = await bookingAsync(value);

        switch (res.statusCode) {
          case 201:
            openNotification("success", "Đặt phòng", "Đặt phòng thành công");
            setDateCheckin("");
            setDateCheckout("");
            break;
          default:
            break;
        }
      },
    });
  };

  const onChangeCheckin: DatePickerProps["onChange"] = (date, dateString) => {
    setDateCheckin(dateString.toString());
  };

  const onChangeCheckout: DatePickerProps["onChange"] = (date, dateString) => {
    setDateCheckout(dateString.toString());
  };

  const handleChangeCountMember = (value: number): void => {
    setCountMember((prevCount) => prevCount + value);
  };

  const handleBooking = (): void => {
    const isLogin: boolean | undefined = checkIsLogin();
    if (isLogin === true) {
      if (dateCheckin !== "" && dateCheckout !== "" && countMember !== 0) {
        showPropsConfirm();
      } else {
        openNotification(
          "warning",
          "Đặt phòng",
          "Bạn phải điền đầy đủ các thông tin"
        );
      }
    } else {
      openNotification(
        "warning",
        "Đặt phòng",
        "Bạn phải đăng nhập để đặt phòng"
      );
    }
  };

  const getBooking = () => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  const checkBooking = (): void => {
    let bookingId: BookingType[] = [];
    const dates: Set<string> = new Set();

    bookings.forEach((booking: BookingType) => {
      if (booking.maPhong === data.id) {
        bookingId.push(booking);
      }
    });
    if (bookingId.length > 0) {
      bookingId.forEach((item: BookingType) => {
        const checkin = dayjs(item.ngayDen);
        const checkout = dayjs(item.ngayDi);

        let currentDate = checkin;

        while (
          currentDate.isBefore(checkout, "day") ||
          currentDate.isSame(checkout, "day")
        ) {
          const formattedDate = currentDate.format("YYYY-MM-DD");

          dates.add(formattedDate);
          currentDate = currentDate.add(1, "day");
        }
      });
    }
    const arrDate: string[] = Array.from(dates);

    const disabledDates: dayjs.Dayjs[] = arrDate.map((date) =>
      dayjs(date, "YYYY-MM-DD")
    );
    setListDate(disabledDates);
  };

  // const disabledDate = (current: any): boolean => {
  //   return listDate.some((date) => date.isSame(current, "day"));
  // };
  const disabledDate = (current: any): boolean => {
    return (
      current.isBefore(dayjs(), "day") || // Ngày trước ngày hiện tại
      listDate.some((disabledDate) => disabledDate.isSame(current, "day")) // Ngày trong danh sách
    );
  };

  useEffect(() => {
    const countDate: number = calculateDaysBetween(dateCheckin, dateCheckout);
    setCountDate(countDate);
    getBooking();
  }, [dateCheckout]);

  useEffect(() => {
    if (bookings.length > 0) {
      checkBooking();
    }
  }, [bookings]);

  useEffect(() => {
    getCommentToRoom();
  }, [data]);

  useEffect(() => {
    if (comments) {
      setCommentCount(comments.length);
    }
  }, [comments]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            lineWidth: 0,
            activeShadow: "transparent",
            paddingInline: 0,
            colorBgContainer: "transparent",
            paddingBlock: 0,
          },
          DatePicker: {
            lineWidth: 0,
            activeShadow: "transparent",
            colorBgContainer: "transparent",
            paddingInline: 0,
          },
        },
      }}
    >
      <div className="w-full my-5 border shadow-sm p-5 rounded-xl">
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">
            ${data.giaTien}
            <span className="text-sm font-normal">/đêm</span>
          </p>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon className="text-primary-100" icon={faStar} />
            <p className="font-bold text-custome-black-100">
              {setRatingRoom()}
              <span className="font-normal text-custome-gray-200">
                {` (${commentCount} đánh giá)`}
              </span>
            </p>
          </div>
        </div>
        <div className="border rounded-lg mt-5">
          <div className="flex">
            <div className="w-[50%] border-e p-2">
              <p className="text-[12px] font-medium">Nhận phòng</p>
              <DatePicker
                suffixIcon={false}
                placeholder="Thêm ngày"
                className="!py-0"
                onChange={onChangeCheckin}
                disabledDate={disabledDate}
              />
            </div>
            <div className="w-[50%] p-2">
              <p className="text-[12px] font-medium">Trả phòng</p>
              <DatePicker
                suffixIcon={false}
                placeholder="Thêm ngày"
                className="!py-0"
                onChange={onChangeCheckout}
                disabledDate={disabledDate}
              />
            </div>
          </div>
          <div className="border-t p-2">
            <Dropdown
              trigger={["click"]}
              placement="bottom"
              dropdownRender={() => (
                <ModalCustomer
                  member={countMember}
                  handleChangeCountMember={handleChangeCountMember}
                />
              )}
            >
              <div>
                <p className="text-[12px] font-medium">Khách</p>
                <Input placeholder="Số lượng khách" value={countMember} />
              </div>
            </Dropdown>
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="w-full py-2 bg-primary-100 text-white font-medium rounded-[7px] mt-2 transition-all duration-500 ease-in-out hover:bg-primary-200"
        >
          Đặt phòng
        </button>
        {/* <a
          href="#"
          className="underline text-center text-custome-gray-200 block my-2"
        >
          Bạn vẫn chưa bị trừ tiền
        </a> */}
        <div className="mt-5 py-4 border-b">
          <div className="flex items-center justify-between py-1">
            <p className="underline">
              ${data.giaTien} x {countDate} đêm
            </p>
            <p>${data.giaTien * countDate}</p>
          </div>
          <div className="flex items-center justify-between py-1">
            <p className="underline">Phí dịch vụ</p>
            <p>${countMember * 5}</p>
          </div>
        </div>

        <div className="py-3 flex items-center justify-between">
          <h3 className="font-bold">Tổng</h3>
          <p className="font-bold">
            ${data.giaTien * countDate + countMember * 5}
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default OptionBookingContainer;
