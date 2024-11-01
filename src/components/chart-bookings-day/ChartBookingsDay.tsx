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
import { getDateRange } from "@/utils/method/method";

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

const ChartBookingsDay: React.FC<Props> = ({}) => {
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [dayOfMonth, setDayOfMonth] = useState<string[]>([]);
  const [labelsDay, setLabelDay] = useState<string[]>([]);
  const [countMemberOfDay, setCountMemberOfDay] = useState<number[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.room);

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  // Dữ liệu cho biểu đồ
  const data: ChartData<"line"> = {
    labels: labelsDay,
    datasets: [
      {
        label: "Số lượng khách trong ngày",
        data: countMemberOfDay,
        backgroundColor: "#FF385C",
        borderColor: "#FF385C",
        borderWidth: 1,
        fill: true,
        tension: 0,
      },
    ],
  };

  // Tùy chọn cho biểu đồ
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
        text: `Thống kê lượt khách trong tháng `,
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
  ): number[] => {
    const bookingCounts = daysOfMonth.map(() => 0);

    bookings.forEach((booking: BookingType) => {
      const startDate = new Date(booking.ngayDen);
      const endDate = new Date(booking.ngayDi);

      daysOfMonth.map((day: string, index: number) => {
        const currentDate = new Date(day);

        if (currentDate >= startDate && currentDate <= endDate) {
          bookingCounts[index]++;
        }
      });
    });

    return bookingCounts;
  };

  useEffect(() => {
    if (bookings.length > 0 && dayOfMonth) {
      const count: number[] = countBookingsPerDay(bookings, dayOfMonth);
      setCountMemberOfDay(count);
    } else {
      setCountMemberOfDay([]);
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
      {labelsDay.length > 0 && countMemberOfDay.length > 0 && (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default ChartBookingsDay;
