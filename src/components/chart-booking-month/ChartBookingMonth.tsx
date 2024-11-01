import { BookingType } from "@/types/booking/bookingType.type";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import { DatePicker } from "antd";
import { AppDispatch, RootState } from "@/app/globalRedux/store";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { getDateRange, totalCountMember } from "@/utils/method/method";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  const [countMemberOfMonth, setCountMemberOfMonth] = useState<number[]>([]);

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  const data: ChartData<"line"> = {
    labels: labelMonth,
    datasets: [
      {
        label: "Số lượng khách trong tháng",
        data: countMemberOfMonth,
        backgroundColor: "#FF385C",
        borderColor: "#FF385C",
        borderWidth: 1,
        fill: true,
        tension: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
      title: {
        display: true,
        text: `Tổng lượt khách trong năm: ${totalCountMember(
          countMemberOfMonth
        )} Khách`,
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
  ): number[] => {
    const countBookingOfYear: number[] = monthOfYear.map(() => 0);

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

            if (newDay >= firstDayOfMonth && newDay <= lastDayOfMonth) {
              countBookingOfYear[index]++;
            }
          });
        });
      }
    });

    return countBookingOfYear;
  };

  useEffect(() => {
    if (bookings.length > 0 && monthOfYear.length > 0) {
      const count: number[] = hadleChangeCountBookingOfMonth(
        bookings,
        monthOfYear
      );
      setCountMemberOfMonth(count);
    } else {
      setCountMemberOfMonth([]);
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
      {labelMonth.length > 0 && countMemberOfMonth.length > 0 && (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default ChartBookingMonth;
