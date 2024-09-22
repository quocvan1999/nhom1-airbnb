"use client";

import HeaderModalCustomer from "@/components/header-modal-customer/HeaderModalCustomer";
import HeaderModalLocation from "@/components/header-modal-location/HeaderModalLocation";
import useStatusHeader from "@/custome-hook/useStatusHeader/useStatusHeader";
import { LocationType } from "@/types/location/locationType.type";
import {
  ConfigProvider,
  DatePicker,
  DatePickerProps,
  Dropdown,
  Input,
} from "antd";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const HeaderSearch: React.FC<Props> = ({}) => {
  const router = useRouter();
  const [location, setLocation] = useState<LocationType>({
    hinhAnh: "",
    id: 0,
    quocGia: "",
    tenViTri: "",
    tinhThanh: "",
  });
  const {
    typeSearch,
    setTypeSearch,
    isScroll,
    isShowSearch,
    setIsShowSearch,
    setIsScroll,
  } = useStatusHeader();
  const [totalMember, setTotalMember] = useState<number>(0);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleChangeTypeSearch: () => void = () => {
    setTypeSearch(!typeSearch);
  };

  const handleSearch = () => {
    router.push(`/search?keyword=${location.id}`);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            lineWidth: 0,
            activeShadow: "transparent",
            paddingInline: 0,
            colorBgContainer: "transparent",
            paddingBlock: 0,
          },
          DatePicker: {
            lineWidth: 0,
            activeShadow: "transparent",
            colorBgContainer: "transparent",
            paddingInline: 0,
          },
        },
      }}
    >
      <div className="flex flex-col items-center relative">
        {isScroll === false && (
          <motion.ul
            className="flex gap-3 font-medium text-gray-400"
            transition={{ duration: 0.5 }}
          >
            <li
              className={` cursor-pointer ${
                typeSearch === false && "text-custome-black-100"
              }`}
              onClick={handleChangeTypeSearch}
            >
              Chỗ ở
            </li>
            <li
              className={` cursor-pointer ${
                typeSearch === true && "text-custome-black-100"
              }`}
              onClick={handleChangeTypeSearch}
            >
              Trải nghiệm
            </li>
          </motion.ul>
        )}
        {isShowSearch === true && (
          <div
            onClick={() => {
              setIsShowSearch(false);
              setIsScroll(true);
              document.body.style.overflow = "";
            }}
            className="w-full h-full fixed top-0 left-0 right-0 bottom-0 bg-[#222222b6] z-10 cursor-pointer transition-all duration-500 ease-in-out"
          ></div>
        )}
        <motion.div
          onClick={() => {
            if (isScroll === true) {
              setIsShowSearch(true);
              setIsScroll(false);
              document.body.style.overflow = "hidden";
            }
          }}
          className={`flex justify-around border bg-white rounded-full shadow-sm ${
            isScroll === false && "fixed"
          } ${isShowSearch === true && "z-20 !l-[50%] "}`}
          animate={{
            y: isScroll ? 0 : 50,
          }}
          initial={{ y: 50 }}
          transition={{ duration: 0.5 }}
        >
          {isScroll === false ? (
            <>
              <div className="px-7 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer">
                <p className="text-[12px] font-medium">Địa điểm</p>
                <Dropdown
                  trigger={["click"]}
                  placement="bottom"
                  dropdownRender={() => (
                    <HeaderModalLocation setLocation={setLocation} />
                  )}
                >
                  <Input
                    value={location.tenViTri}
                    placeholder="Tìm kiếm điểm đến"
                  />
                </Dropdown>
              </div>
              <div className="px-7 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer">
                <p className="text-[12px] font-medium">
                  {typeSearch === false ? "Nhận phòng" : "Ngày"}
                </p>
                <DatePicker
                  suffixIcon={false}
                  placeholder="Thêm ngày"
                  className="!py-0"
                  onChange={onChange}
                />
              </div>
              {typeSearch === false && (
                <div className="px-7 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer">
                  <p className="text-[12px] font-medium">Trả phòng</p>
                  <DatePicker
                    suffixIcon={false}
                    placeholder="Thêm ngày"
                    className="!py-0"
                    onChange={onChange}
                  />
                </div>
              )}
              <div className="ps-7 pe-2 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer flex justify-between">
                <div>
                  <p className="text-[12px] font-medium">Thêm khách</p>
                  <Dropdown
                    trigger={["click"]}
                    placement="bottom"
                    dropdownRender={() => (
                      <HeaderModalCustomer setTotalMember={setTotalMember} />
                    )}
                  >
                    <Input
                      placeholder="Tìm kiếm điểm đến"
                      value={totalMember === 0 ? "" : totalMember}
                    />
                  </Dropdown>
                </div>
                <div
                  onClick={handleSearch}
                  className="rounded-full bg-primary-100 top-0 right-0 flex items-center justify-center p-2 transition-all duration-500 ease-in-out hover:bg-primary-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ fill: "white" }}
                  >
                    <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="flex">
              <ul className="flex p-1 items-center cursor-pointer">
                <li className="px-2 font-medium text-black">Địa điểm bất kỳ</li>
                <li className="border-s border-e px-2 font-medium text-black">
                  Tuần bất kỳ
                </li>
                <li className="px-2 text-custome-gray-200">Thêm bất kỳ</li>
              </ul>
              <div className="bg-primary-100 m-1 rounded-full p-2 cursor-pointer transition-all duration-500 ease-in-out hover:bg-primary-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  style={{ fill: "white" }}
                >
                  <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                </svg>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ConfigProvider>
  );
};

export default HeaderSearch;
