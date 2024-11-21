"use client";

import { setIsLoadingNotification } from "@/app/[locale]/globalRedux/features/statusAppSlice";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useNotifiCustome from "@/custome-hook/useNotifiCustome/useNotifiCustome";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { deleteBookingAsync } from "@/services/delete-booking/deleteBooking.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { NotifiType } from "@/types/notifi/notifi.type";
import { RoomType } from "@/types/room/roomType.type";
import { User } from "@/types/user/userType.type";
import {
  formatDate,
  formatDateTime,
  getCurrentDateTime,
  getFormattedDateTime,
  truncateString,
} from "@/utils/method/method";
import { httpClient } from "@/utils/setting/setting";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import {
  Modal,
  Pagination,
  Spin,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { createStyles } from "antd-style";
import { AxiosResponse } from "axios";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

type ValueFilter = {
  text: string | number;
  value: string | number;
};

type NewBookingType = Omit<BookingType, "maNguoiDung" | "maPhong"> & {
  nguoiDung: string;
  tenPhong: string;
};

const useStyle = createStyles(({ css }) => {
  return {
    customTable: css`
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: unset;
        }
      }
    `,
  };
});

const { confirm } = Modal;

const Bookings: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { getParams, searchParams } = useGetSearchPrams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [valuesFilterNgayDen, setValuesFilterNgayDen] = useState<ValueFilter[]>(
    []
  );
  const [valuesFilterNgayDi, setValuesFilterNgayDi] = useState<ValueFilter[]>(
    []
  );
  const { bookings } = useSelector((state: RootState) => state.room);
  const [paginatedData, setPaginatedData] = useState<NewBookingType[] | null>(
    null
  );
  const { createNotification } = useNotifiCustome();
  const { profile } = useSelector((state: RootState) => state.user);
  const { size, page } = getParams();

  function transformData(array: NewBookingType[], field: keyof NewBookingType) {
    const uniqueValues = new Set();

    return array.reduce((result, item) => {
      const value = item[field];
      if (!uniqueValues.has(value)) {
        uniqueValues.add(value);
        result.push({
          text: value,
          value: value,
        });
      }
      return result;
    }, [] as { text: any; value: any }[]);
  }

  const handleDeleteBooking = (id: number): void => {
    confirm({
      title: "Xoá phòng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn xoá đặt phòng này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      cancelButtonProps: {
        className: "custom-cancel-button",
      },
      onOk: async (): Promise<void> => {
        const res = await deleteBookingAsync(id);

        switch (res.statusCode) {
          case 200:
            openNotification("success", "Xoá đặt phòng", `${res.message}`);
            setIsLoading(!isLoading);

            const newNotification: NotifiType = {
              id: `DelRoo${getFormattedDateTime()}`,
              title: "Quản lý đặt phòng",
              content: "Xoá đặt phòng thành công",
              date: `${getCurrentDateTime()}`,
              type: "success",
            };

            createNotification(
              `${process.env.NEXT_PUBLIC_NOTIFICATION_ADMIN}-${profile.id}`,
              newNotification
            );
            const action = setIsLoadingNotification();
            dispatch(action);
            break;
          default:
            openNotification("error", "Xoá đặt phòng", `${res.content}`);
            break;
        }
      },
    });
  };

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  const getUser = async (): Promise<void> => {
    const res: AxiosResponse = await httpClient.get("/api/users");
    setUsers(res.data.content);
  };

  const getRoom = async (): Promise<void> => {
    const res: AxiosResponse = await httpClient.get("/api/phong-thue");
    setRooms(res.data.content);
  };

  const columns: TableColumnsType<NewBookingType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Khách hàng",
      dataIndex: "nguoiDung",
      key: "nguoiDung",
    },
    {
      title: "Phòng",
      dataIndex: "tenPhong",
      key: "tenPhong",
      render: (tenPhong) => (
        <Tooltip title={tenPhong}>{truncateString(tenPhong, 30)}</Tooltip>
      ),
    },
    {
      title: "Ngày đến",
      dataIndex: "ngayDen",
      key: "ngayDen",
      render: (date) => formatDateTime(date),
      filters: valuesFilterNgayDen,
      onFilter: (value, record) => record.ngayDen === value,
      filterSearch: true,
    },
    {
      title: "Ngày đi",
      dataIndex: "ngayDi",
      key: "ngayDi",
      render: (date) => formatDateTime(date),
      filters: valuesFilterNgayDi,
      onFilter: (value, record) => record.ngayDi === value,
      filterSearch: true,
    },
    {
      title: "Số lượng khách",
      dataIndex: "soLuongKhach",
      key: "soLuongKhach",
      sorter: (a: NewBookingType, b: NewBookingType) =>
        a.soLuongKhach - b.soLuongKhach,
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "actions",
      render: (record: NewBookingType) => (
        <div className="flex items-center justify-center">
          <DeleteOutlined
            onClick={() => {
              handleDeleteBooking(record.id);
            }}
            className="cursor-pointer transition-all duration-500 ease-in-out !text-[#7E7C86] hover:!text-red-600"
          />
        </div>
      ),
    },
  ];

  const setUserName = (id: number): string => {
    let name: string = "";

    if (users.length > 0) {
      const userData: User | undefined = users.find(
        (item: User) => item.id === id
      );

      if (userData !== undefined) {
        name = userData.name;
      } else {
        name = "Khách hàng";
      }
    }
    return name;
  };

  const setRoomName = (id: number): string => {
    let name: string = "";

    if (rooms.length > 0) {
      const roomData: RoomType | undefined = rooms.find(
        (item: RoomType) => item.id === id
      );

      if (roomData !== undefined) {
        name = roomData.tenPhong;
      } else {
        name = "";
      }
    }
    return name;
  };

  useEffect(() => {
    getData();
    getUser();
    getRoom();
  }, [isLoading]);

  useEffect(() => {
    if (bookings.length > 0) {
      const data = bookings.slice(
        (Number(page) - 1) * Number(size),
        Number(page) * Number(size)
      );

      if (data) {
        const newData: NewBookingType[] = [];

        data.map((booking: BookingType) => {
          let userName: string = setUserName(Number(booking.maNguoiDung));
          let roomname: string = setRoomName(Number(booking.maPhong));

          newData.push({
            id: booking.id,
            ngayDen: booking.ngayDen,
            ngayDi: booking.ngayDi,
            nguoiDung: userName,
            soLuongKhach: booking.soLuongKhach,
            tenPhong: roomname,
          });
        });

        console.log("CHECK NEW DATA", newData);

        setPaginatedData(newData);
        setValuesFilterNgayDen(transformData(newData, "ngayDen"));
        setValuesFilterNgayDi(transformData(newData, "ngayDi"));
      }
    }
  }, [bookings, searchParams]);

  return (
    <>
      <div className="w-full h-full">
        <div className="hidden md:block w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
          {bookings && paginatedData && paginatedData.length > 0 && bookings ? (
            <Table
              className={styles.customTable}
              dataSource={paginatedData.map((item, index) => ({
                ...item,
                key: index,
              }))}
              columns={columns}
              pagination={false}
              footer={() => (
                <Pagination
                  align="end"
                  current={Number(page)}
                  defaultPageSize={Number(size)}
                  total={bookings.length}
                  onChange={(page: number, pageSize: number): void => {
                    router.push(
                      `/${locale}/admin/bookings/?page=${page}&size=${pageSize}`
                    );
                  }}
                  showSizeChanger
                />
              )}
            />
          ) : (
            <div className="w-full h-[500px] flex items-center justify-center">
              <Spin />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-wrap gap-2 md:hidden mt-3">
          {bookings && paginatedData && paginatedData.length > 0 && bookings ? (
            <>
              {paginatedData.map((item: NewBookingType, index: number) => (
                <div
                  className="w-full p-3 rounded-lg bg-white shadow-md"
                  key={index}
                >
                  <div>
                    <h1 className="font-bold">{item.id}</h1>
                    <p>
                      <span className="font-semibold">Ngày đến: </span>
                      {formatDate(item.ngayDen)}
                    </p>
                    <p>
                      <span className="font-semibold">Ngày đến: </span>
                      {formatDate(item.ngayDi)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      onClick={() => {
                        handleDeleteBooking(item.id);
                      }}
                      className="text-primary-100 hover:underline pt-3"
                    >
                      Xoá
                    </p>
                  </div>
                </div>
              ))}
              <Pagination
                align="end"
                current={Number(page)}
                defaultPageSize={Number(size)}
                total={bookings.length}
                onChange={(page: number, pageSize: number): void => {
                  router.push(
                    `/${locale}/admin/bookings/?page=${page}&size=${pageSize}`
                  );
                }}
                showSizeChanger
              />
            </>
          ) : (
            <Spin />
          )}
        </div>
      </div>
    </>
  );
};

export default Bookings;
