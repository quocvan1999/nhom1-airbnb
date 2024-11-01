"use client";

import ChartBookingMonth from "@/components/chart-booking-month/ChartBookingMonth";
import ChartBookingsDay from "@/components/chart-bookings-day/ChartBookingsDay";
import { faChartLine, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Tabs } from "antd";
import React from "react";

type Props = {};

const LineChartComponent: React.FC<Props> = ({}) => {
  return (
    <ConfigProvider theme={{ components: { Tabs: { itemColor: "#6a6a6a" } } }}>
      <Tabs
        defaultActiveKey="1"
        style={{ color: "#6a6a6a" }}
        items={[
          {
            key: "1",
            label: "Thống kê theo tháng",
            icon: <FontAwesomeIcon size="lg" icon={faChartLine} />,
            children: <ChartBookingsDay />,
          },
          {
            key: "2",
            label: "Thống kê theo năm",
            icon: <FontAwesomeIcon size="lg" icon={faChartPie} />,
            children: <ChartBookingMonth />,
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default LineChartComponent;
