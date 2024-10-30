"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { BookingType } from "@/types/booking/bookingType.type";
import { ChartDataType } from "@/types/chart-data/ChartDataType.type";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Props = {};

const LineChartComponent: React.FC<Props> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const [chartData, setChartData] = useState<ChartDataType[]>();
  const { bookings } = useSelector((state: RootState) => state.room);

  const processData = (
    bookings: BookingType[],
    period: "day" | "month" | "year"
  ): ChartDataType[] => {
    const groupedData: Record<string, number> = {};

    bookings.forEach((booking) => {
      let key: string; // Khai báo biến key

      // Xác định key theo ngày, tháng hoặc năm
      if (period === "day") {
        key = booking.ngayDen; // hoặc booking.ngayDi, tùy thuộc vào nhu cầu
      } else if (period === "month") {
        key = booking.ngayDen.substring(0, 7); // YYYY-MM
      } else if (period === "year") {
        key = booking.ngayDen.substring(0, 4); // YYYY
      } else {
        return; // Nếu không có lựa chọn hợp lệ, kết thúc vòng lặp
      }

      // Cộng dồn số lượng khách cho từng key
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += booking.soLuongKhach;
    });

    // Chuyển đổi sang định dạng mảng để biểu đồ
    return Object.entries(groupedData).map(([key, value]) => ({
      date: key,
      guests: value,
    }));
  };

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const data: ChartDataType[] = processData(bookings, "month");
    if (data) {
      setChartData(data);
    }
  }, [bookings]);

  return (
    <>
      {chartData && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="guests"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default LineChartComponent;
