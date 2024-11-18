import { ConfigProvider, Spin } from "antd";
import React from "react";

type Props = {};

const loading: React.FC<Props> = ({}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Spin: {
            colorPrimary: "#FF385C",
          },
        },
      }}
    >
      <div className="w-full h-[100vh] fixed top-0 left-0 right-0 bg-[#ffffffaf] z-[1500] flex items-center justify-center">
        <Spin size="large" />
      </div>
    </ConfigProvider>
  );
};

export default loading;
