"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import useGetSearchPrams from "@/custome-hook/useGetSearchPrams/useGetSearchPrams";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { deleteBookingAsync } from "@/services/delete-booking/deleteBooking.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { formatDateTime } from "@/utils/method/method";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Modal, Pagination, Spin, Table, TableColumnsType } from "antd";
import { createStyles } from "antd-style";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {};

type ValueFilter = {
  text: string | number;
  value: string | number;
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
  const router = useRouter();
  const { styles } = useStyle();
  const dispatch: AppDispatch = useDispatch();
  const { openNotification } = useNotification();
  const { getParams, searchParams } = useGetSearchPrams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [valuesFilterNgayDen, setValuesFilterNgayDen] = useState<ValueFilter[]>(
    []
  );
  const [valuesFilterNgayDi, setValuesFilterNgayDi] = useState<ValueFilter[]>(
    []
  );
  const [valuesFilterMaNguoiDung, setValuesFilterMaNguoiDung] = useState<
    ValueFilter[]
  >([]);
  const [valuesFilterMaPhong, setValuesFilterMaPhong] = useState<ValueFilter[]>(
    []
  );

  const { bookings } = useSelector((state: RootState) => state.room);
  const [paginatedData, setPaginatedData] = useState<BookingType[] | null>(
    null
  );

  const { size, page } = getParams();

  function transformData(array: BookingType[], field: keyof BookingType) {
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

  const columns: TableColumnsType<BookingType> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Mã phòng",
      dataIndex: "maPhong",
      key: "maPhong",
      sorter: (a: BookingType, b: BookingType) => a.maPhong - b.maPhong,
      filters: valuesFilterMaPhong,
      onFilter: (value, record) => record.maPhong === value,
      filterSearch: true,
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
      sorter: (a: BookingType, b: BookingType) =>
        a.soLuongKhach - b.soLuongKhach,
    },
    {
      title: "Mã người dùng",
      dataIndex: "maNguoiDung",
      key: "maNguoiDung",
      filters: valuesFilterMaNguoiDung,
      onFilter: (value, record) => record.maNguoiDung === value,
      filterSearch: true,
    },
    {
      title: "Chức năng",
      dataIndex: "",
      key: "actions",
      render: (record: BookingType) => (
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

  useEffect(() => {
    getData();
  }, [isLoading]);

  useEffect(() => {
    if (bookings.length > 0) {
      const data = bookings.slice(
        (Number(page) - 1) * Number(size),
        Number(page) * Number(size)
      );
      setPaginatedData(data);

      setValuesFilterMaPhong(transformData(data, "maPhong"));
      setValuesFilterMaNguoiDung(transformData(data, "maNguoiDung"));
      setValuesFilterNgayDen(transformData(data, "ngayDen"));
      setValuesFilterNgayDi(transformData(data, "ngayDi"));
    }
  }, [bookings, searchParams]);

  return (
    <>
      <div className="w-full h-full !relative">
        <div className="w-full h-[calc(100%-50px)] bg-white rounded-lg mt-2">
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
                      `/admin/bookings/?page=${page}&size=${pageSize}`
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
      </div>
    </>
  );
};

export default Bookings;
