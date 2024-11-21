"use client";

import useNotification from "@/custome-hook/useNotification/useNotification";
import { BookingType } from "@/types/booking/bookingType.type";
import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Dropdown,
  Input,
  Modal,
} from "antd";
import dayjs from "dayjs";
import {
  formatDate,
  getCookie,
  getCurrentDateTime,
  getFormattedDateTime,
} from "@/utils/method/method";
import ModalCustomer from "@/components/modal-customer/ModalCustomer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { RoomType } from "@/types/room/roomType.type";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ReqType } from "@/types/req/reqType.type";
import { updateBookingAsync } from "@/services/update-booking/updateBooking.service";
import { getBookingUserAsync } from "@/services/booking-user/bookingUser.service";
import { NotifiType } from "@/types/notifi/notifi.type";
import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { useTranslations } from "next-intl";

const { confirm } = Modal;

type Props = {
  roomDetail: RoomType | undefined;
  booking: BookingType;
  isModalUpdateBookingOpen: boolean;
  setIsModalUpdateBookingOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const dateFormat = "YYYY-MM-DD";

const ModalUpdateBooking: React.FC<Props> = ({
  booking,
  isModalUpdateBookingOpen,
  setIsModalUpdateBookingOpen,
  roomDetail,
}) => {
  const tModalUpdateBooking = useTranslations("ModalUpdateBooking");
  const tNotification = useTranslations("Notification");
  const tLocalNotifi = useTranslations("LocalNotifi");
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const [countMember, setCountMember] = useState<number>(0);
  const [dateCheckin, setDateCheckin] = useState<string>("");
  const [dateCheckout, setDateCheckout] = useState<string>("");
  const [listDate, setListDate] = useState<dayjs.Dayjs[]>([]);
  const { bookings } = useSelector((state: RootState) => state.room);
  const { profile } = useSelector((state: RootState) => state.user);
  const { createNotification } = useNotifiCustome();

  const handleCancel = (): void => {
    setIsModalUpdateBookingOpen(false);
  };

  const handleChangeUpdateBooking = async (): Promise<void> => {
    const boonkingUpdate: BookingType = {
      id: booking.id,
      maNguoiDung: booking.maNguoiDung,
      maPhong: booking.maPhong,
      ngayDen: dateCheckin,
      ngayDi: dateCheckout,
      soLuongKhach: countMember,
    };

    confirm({
      title: `${tModalUpdateBooking("ConfirmUpdate.title")}`,
      icon: <ExclamationCircleFilled />,
      content: `${tModalUpdateBooking("ConfirmUpdate.content")}`,
      okText: `${tModalUpdateBooking("ConfirmUpdate.okText")}`,
      okType: "danger",
      cancelText: `${tModalUpdateBooking("ConfirmUpdate.cancelText")}`,
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res: ReqType<BookingType> = await updateBookingAsync(
          booking.id,
          boonkingUpdate
        );

        switch (res.statusCode) {
          case 200:
            const id: string | null = getCookie("i_d");
            const action = getBookingUserAsync(Number(id));
            dispatch(action);
            openNotification(
              "success",
              `${tNotification(
                "ModalUpdateBooking.updateBookingSuccess.title"
              )}`,
              `${tNotification(
                "ModalUpdateBooking.updateBookingSuccess.content"
              )}`
            );
            setIsModalUpdateBookingOpen(false);

            const newNotification: NotifiType = {
              id: `Fav${getFormattedDateTime()}`,
              title: `${tLocalNotifi("ModalUpdateBooking.unlikeRoom.title")}`,
              content: `${tLocalNotifi(
                "ModalUpdateBooking.unlikeRoom.content"
              )}`,
              date: `${getCurrentDateTime()}`,
              type: "success",
            };
            createNotification(
              `${process.env.NEXT_PUBLIC_NOTIFICATION_CLIENT}-${profile.id}`,
              newNotification
            );

            const actionN = setIsLoadingNotification();
            dispatch(actionN);
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

  const getBooking = () => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  const checkBooking = (): void => {
    let bookingId: BookingType[] = [];
    const dates: Set<string> = new Set();

    if (roomDetail !== undefined) {
      bookings.forEach((booking: BookingType) => {
        if (booking.maPhong === roomDetail?.id) {
          bookingId.push(booking);
        }
      });
    }
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

  const disabledDate = (current: any): boolean => {
    return (
      current.isBefore(dayjs(), "day") || // Ngày trước ngày hiện tại
      listDate.some((disabledDate) => disabledDate.isSame(current, "day")) // Ngày trong danh sách
    );
  };

  const handleChangeCountMember = (value: number): void => {
    setCountMember((prevCount) => prevCount + value);
  };

  useEffect(() => {
    if (booking) {
      setDateCheckin(booking.ngayDen);
      setDateCheckout(booking.ngayDi);
      setCountMember(booking.soLuongKhach);
    }
    getBooking();
  }, []);

  useEffect(() => {
    if (bookings.length > 0) {
      checkBooking();
    }
  }, [bookings]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            borderRadiusLG: 7,
            colorBgContainer: "#f7f7f7",
            lineType: "none",
            paddingInlineLG: 20,
            activeShadow: "none",
          },
          DatePicker: {
            lineWidth: 0,
            activeShadow: "transparent",
            colorBgContainer: "#f7f7f7",
            paddingInline: 20,
          },
          Dropdown: {
            borderRadiusLG: 0,
            borderRadius: 0,
            borderRadiusOuter: 0,
            borderRadiusSM: 0,
            borderRadiusXS: 0,
          },
        },
      }}
    >
      <Modal
        width={450}
        open={isModalUpdateBookingOpen}
        footer={null}
        onCancel={handleCancel}
      >
        <div className="w-full bg-white rounded-xl">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-2xl font-bold">
              {tModalUpdateBooking("title")}
            </h1>
          </div>
          <div>
            <div className="mb-5">
              <p className="font-semibold uppercase text-xs mb-2">
                {tModalUpdateBooking("checkin")}
              </p>
              <DatePicker
                defaultValue={dayjs(formatDate(dateCheckin), dateFormat)}
                onChange={onChangeCheckin}
                size="large"
                className="w-full"
                disabledDate={disabledDate}
                format={{
                  format: "YYYY-MM-DD",
                  type: "mask",
                }}
              />
            </div>

            <div className="mb-5">
              <p className="font-semibold uppercase text-xs mb-2">
                {tModalUpdateBooking("checkout")}
              </p>
              <DatePicker
                defaultValue={dayjs(formatDate(dateCheckout), dateFormat)}
                onChange={onChangeCheckout}
                size="large"
                disabledDate={disabledDate}
                className="w-full py-1"
                format={{
                  format: "YYYY-MM-DD",
                  type: "mask",
                }}
              />
            </div>

            <div className="mb-5">
              <p className="font-semibold uppercase text-xs mb-2">
                {tModalUpdateBooking("countNumber")}
              </p>
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
                <Input
                  className="py-0"
                  size="large"
                  placeholder={tModalUpdateBooking("selectCountNumber")}
                  value={countMember}
                />
              </Dropdown>
            </div>

            <div className="flex items-center justify-end">
              <Button onClick={handleChangeUpdateBooking} type="primary">
                {tModalUpdateBooking("UpdateButtonTitle")}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default ModalUpdateBooking;
