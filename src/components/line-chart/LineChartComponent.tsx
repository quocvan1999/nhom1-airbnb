"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ChartBookingsDay from "@/components/chart-bookings-day/ChartBookingsDay";
import { getBookingsAsync } from "@/services/bookings/bookings.service";
import { faChartLine, faChartPie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Tabs } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

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
            label: "Thống kê theo ngày",
            icon: <FontAwesomeIcon size="lg" icon={faChartLine} />,
            children: <ChartBookingsDay />,
          },
          {
            key: "2",
            label: "Thống kê theo tháng",
            icon: <FontAwesomeIcon size="lg" icon={faChartPie} />,
            children: <div></div>,
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default LineChartComponent;
