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
  const [isDate, setIsDate] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [countMember, setCountMember] = useState<number[]>([]);
  const dispatch: AppDispatch = useDispatch();
  const { bookings } = useSelector((state: RootState) => state.room);

  const getData = (): void => {
    const action = getBookingsAsync;
    dispatch(action);
  };

  // Dữ liệu cho biểu đồ
  const data: ChartData<"line"> = {
    labels: labels,
    datasets: [
      {
        label: "Số lượng khách trong ngày",
        data: countMember,
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

      const day1Array = Array.from({ length: daysInMonth }, (_, i) =>
        dayjs(new Date(date.year(), month, i + 1)).format("DD-MM")
      );

      const day2Array = Array.from({ length: daysInMonth }, (_, i) =>
        dayjs(new Date(year, month, i + 1)).format("YYYY-MM-DD")
      );
      setLabels(day1Array);
      setIsDate(day2Array);
    } else {
      setLabels([]);
      setIsDate([]);
    }
  };

  function countBookingsPerDay(
    bookings: BookingType[],
    daysOfMonth: string[]
  ): number[] {
    const bookingCounts = new Array(daysOfMonth.length).fill(0);

    bookings.forEach((booking) => {
      const startDate = new Date(booking.ngayDen);
      const endDate = new Date(booking.ngayDi);

      daysOfMonth.forEach((day, index) => {
        const currentDate = new Date(day);

        if (currentDate >= startDate && currentDate <= endDate) {
          bookingCounts[index]++;
        }
      });
    });

    return bookingCounts;
  }

  useEffect(() => {
    if (bookings.length > 0 && isDate) {
      const count: number[] = countBookingsPerDay(bookings, isDate);
      setCountMember(count);
    } else {
      setCountMember([]);
    }
  }, [isDate, bookings]);

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
      {labels.length > 0 && countMember.length > 0 && (
        <Line data={data} options={options} />
      )}
    </div>
  );
};

export default ChartBookingsDay;
