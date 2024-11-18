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
} from "chart.js";
import { DatePicker } from "antd";
import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { getMonthString, totalCountMember } from "@/utils/method/method";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {};

const ChartBookingsDay: React.FC<Props> = ({}) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [dayOfMonth, setDayOfMonth] = useState<string[]>([]);
  const [labelsDay, setLabelDay] = useState<string[]>([]);
  const [countMemberOfDaySuccess, setCountMemberOfDaySuccess] = useState<
    number[]
  >([]);
  const [countMemberOfDayPlan, setCountMemberOfDayPlan] = useState<number[]>(
    []
  );
  const dispatch: AppDispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.room);

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  // Dữ liệu cho biểu đồ
  const data: ChartData<"line" | "bar"> = {
    labels: labelsDay,
    datasets: [
      // {
      //   label: `Số lượng khách đã đến`,
      //   data: countMemberOfDaySuccess,
      //   backgroundColor: "#FF385C",
      //   borderColor: "#FF385C",
      //   borderWidth: 1,
      //   fill: true,
      //   tension: 0,
      //   type: "line",
      // },
      {
        label: `Số lượng khách đã đặt`,
        data: countMemberOfDayPlan,
        backgroundColor: "#9AD0F5",
        borderColor: "#9AD0F5",
        borderWidth: 1,
        type: "bar",
      },
    ],
  };

  // Tùy chọn cho biểu đồ
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
      const daysInMonth = date.daysInMonth();
      const month = date.month();
      const year = date.year();

      const labelsDay: string[] = [...Array(daysInMonth)].map((_, i) =>
        dayjs()
          .year(date.year())
          .month(month)
          .date(i + 1)
          .format("DD-MM")
      );

      const day2Array: string[] = [...Array(daysInMonth)].map((_, i) =>
        dayjs()
          .year(year)
          .month(month)
          .date(i + 1)
          .format("YYYY-MM-DD")
      );

      setLabelDay(labelsDay);
      setDayOfMonth(day2Array);
    } else {
      setLabelDay([]);
      setDayOfMonth([]);
    }
  };

  const countBookingsPerDay = (
    bookings: BookingType[],
    daysOfMonth: string[]
  ): void => {
    const bookingCounts = daysOfMonth.map(() => 0);
    // const bookingPlan = daysOfMonth.map(() => 0);

    bookings.forEach((booking: BookingType) => {
      const startDate = new Date(booking.ngayDen);
      const endDate = new Date(booking.ngayDi);

      daysOfMonth.map((day: string, index: number) => {
        const currentDate = new Date(day);
        // const isDay = new Date(Date.now());

        if (currentDate >= startDate && currentDate <= endDate) {
          bookingCounts[index]++;
        }

        // if (
        //   currentDate >= startDate &&
        //   currentDate <= endDate &&
        //   currentDate <= isDay
        // ) {
        //   bookingPlan[index]++;
        // }
      });
    });

    // setCountMemberOfDaySuccess(bookingPlan);
    setCountMemberOfDayPlan(bookingCounts);
  };

  useEffect(() => {
    if (bookings.length > 0 && dayOfMonth) {
      countBookingsPerDay(bookings, dayOfMonth);
    } else {
      // setCountMemberOfDaySuccess([]);
      setCountMemberOfDayPlan([]);
    }
  }, [dayOfMonth, bookings]);

  useEffect(() => {
    getData();
    setLabelsData();
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
          onChange={(date: dayjs.Dayjs | null) => {
            if (date) {
              setDate(date);
            } else {
              setDate(null);
            }
          }}
          format={{
            format: "YYYY-MM",
            type: "mask",
          }}
          picker="month"
        />
      </div>
      <div className="text-center mb-3">
        <h1 className="font-bold text-lg">
          Tổng lượt khách trong tháng:{" "}
          {getMonthString(date && date.format("YYYY-MM-DD"))}
        </h1>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 bg-primary-100"></div>
          <p>
            Tổng khách hàng đặt phòng:{" "}
            <span className="font-bold">
              {totalCountMember(countMemberOfDayPlan)}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 bg-[#9AD0F5]"></div>
          <p>
            Tổng khách hàng đã đến:{" "}
            <span className="font-bold">
              {totalCountMember(countMemberOfDaySuccess)}
            </span>
          </p>
        </div>
        {/* countMemberOfDaySuccess.length > 0 && */}
      </div>
      {labelsDay.length > 0 && (
        <Chart type="bar" data={data} options={options} />
      )}
    </div>
  );
};

export default ChartBookingsDay;
