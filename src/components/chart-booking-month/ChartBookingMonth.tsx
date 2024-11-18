"use client";

import { BookingType } from "@/types/booking/bookingType.type";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  BarElement,
  BarController,
  LineController
} from "chart.js";
import { DatePicker } from "antd";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import {
  getDateRange,
  getYearString,
  totalCountMember,
} from "@/utils/method/method";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend
);

type Props = {};

const ChartBookingMonth: React.FC<Props> = ({}) => {
  const dispatch: AppDispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.room);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [monthOfYear, setMonthOfYear] = useState<string[]>([]);
  const [labelMonth, setLabelMonth] = useState<string[]>([]);
  const [countMemberOfMonthSucess, setCountMemberOfMonthSucess] = useState<
    number[]
  >([]);
  const [countMemberOfMonthPlan, setCountMemberOfMonthPlan] = useState<
    number[]
  >([]);

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  const data: ChartData<"line" | "bar"> = {
    labels: labelMonth,
    datasets: [
      {
        label: `Số lượng khách đã đến`,
        data: countMemberOfMonthSucess,
        backgroundColor: "#FF385C",
        borderColor: "#FF385C",
        borderWidth: 1,
        fill: true,
        tension: 0,
        type: "line",
      },
      {
        label: `Số lượng khách đã đặt`,
        data: countMemberOfMonthPlan,
        backgroundColor: "#9AD0F5",
        borderColor: "#9AD0F5",
        borderWidth: 1,
        type: "bar",
      },
    ],
  };

  const options: ChartOptions<"line" | "bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const setLabelsData = (): void => {
    if (date !== null) {
      const year = date.year();

      const labelsYear: string[] = [...Array(12)].map((_, i) =>
        dayjs().year(year).month(i).format("MM-YYYY")
      );

      const monthArray: string[] = [...Array(12)].map((_, i) =>
        dayjs().year(year).month(i).format("YYYY-MM-DD")
      );

      setLabelMonth(labelsYear);
      setMonthOfYear(monthArray);
    } else {
      setLabelMonth([]);
      setMonthOfYear([]);
    }
  };

  const hadleChangeCountBookingOfMonth = (
    bookings: BookingType[],
    monthOfYear: string[]
  ): void => {
    const countBookingOfYearPlan: number[] = monthOfYear.map(() => 0);
    const countBookingOfYearSucess: number[] = monthOfYear.map(() => 0);

    bookings.map((booking: BookingType) => {
      // Chuỗi ngày trong booking
      const dayBooking: string[] = getDateRange(
        booking.ngayDen,
        booking.ngayDi
      );

      if (dayBooking) {
        monthOfYear.map((date: string, index: number) => {
          const currentMonth = new Date(date);

          // Ngày đầu tháng
          const firstDayOfMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
          );

          // Ngày cuối tháng
          const lastDayOfMonth = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth() + 1,
            0
          );

          dayBooking.map((dayBk: string) => {
            const newDay = new Date(dayBk);
            const isDay = new Date(Date.now());

            if (newDay >= firstDayOfMonth && newDay <= lastDayOfMonth) {
              countBookingOfYearPlan[index]++;
            }

            if (
              newDay >= firstDayOfMonth &&
              newDay <= lastDayOfMonth &&
              newDay <= isDay
            ) {
              countBookingOfYearSucess[index]++;
            }
          });
        });
      }
    });

    setCountMemberOfMonthPlan(countBookingOfYearPlan);
    setCountMemberOfMonthSucess(countBookingOfYearSucess);
  };

  useEffect(() => {
    if (bookings.length > 0 && monthOfYear.length > 0) {
      hadleChangeCountBookingOfMonth(bookings, monthOfYear);
    } else {
      setCountMemberOfMonthPlan([]);
      setCountMemberOfMonthSucess([]);
    }
  }, [monthOfYear, bookings]);

  useEffect(() => {
    getData();
    if (date !== null) {
      setLabelsData();
    }
  }, [date]);

  useEffect(() => {
    const dateNow: Dayjs = dayjs();
    if (dateNow) {
      setDate(dateNow);
    }
  }, []);

  return (
    <div>
      <div>
        <DatePicker
          allowClear
          value={date}
          onChange={(date: Dayjs) => {
            if (date) {
              setDate(date);
            } else {
              setDate(null);
            }
          }}
          format={{
            format: "YYYY",
            type: "mask",
          }}
          picker="year"
        />
      </div>
      <div className="text-center mb-3">
        <h1 className="font-bold text-lg">
          Tổng lượt khách trong năm:{" "}
          {getYearString(date && date.format("YYYY-MM-DD"))}
        </h1>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 bg-primary-100"></div>
          <p>
            Tổng khách hàng đặt phòng:{" "}
            <span className="font-bold">
              {totalCountMember(countMemberOfMonthPlan)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 bg-[#9AD0F5]"></div>
          <p>
            Tổng khách hàng đã đến:{" "}
            <span className="font-bold">
              {totalCountMember(countMemberOfMonthSucess)}
            </span>
          </p>
        </div>
      </div>
      {labelMonth.length > 0 && countMemberOfMonthPlan.length > 0 && (
        <Chart type="bar" data={data} options={options} />
      )}
    </div>
  );
};

export default ChartBookingMonth;
