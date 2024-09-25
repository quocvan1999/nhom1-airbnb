import { ConfigProvider, Spin } from "antd";
import React from "react";

type Props = {};

const LoadingData: React.FC<Props> = ({}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Spin: { colorPrimary: "#FF385C" },
        },
      }}
    >
      <div className="w-full h-[100vh] fixed top-0 left-0 right-0 bottom-0 bg-[#ffffff] z-[2000] flex justify-center items-center">
        <Spin />
      </div>
    </ConfigProvider>
  );
};

export default LoadingData;
