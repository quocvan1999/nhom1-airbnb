"use client";

import HeaderModalLocation from "@/components/header-modal-location/HeaderModalLocation";
import ModalCustomer from "@/components/modal-customer/ModalCustomer";
import useNotification from "@/custome-hook/useNotification/useNotification";
import useStatusHeader from "@/custome-hook/useStatusHeader/useStatusHeader";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, DatePicker, Dropdown, Input } from "antd";
import { motion } from "framer-motion";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useGetProfile from "@/custome-hook/useGetProfile/useGetProfile";
import { useSelector } from "react-redux";
import { RootState } from "@/app/globalRedux/store";

type Props = {};

const HeaderSearch: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const { openNotification } = useNotification();
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [location, setLocation] = useState<number | null>();
  const [dateCheckin, setDateCheckin] = useState<Dayjs | null>(null);
  const [dateCheckout, setDateCheckout] = useState<Dayjs | null>(null);
  const {
    typeSearch,
    setTypeSearch,
    isScroll,
    isShowSearch,
    setIsShowSearch,
    setIsScroll,
  } = useStatusHeader();
  const [countMember, setCountMember] = useState<number>(0);
  const [xValue, setXValue] = useState<number>(40);
  const { checkIsLogin } = useCheckLogin();
  const { getProfile } = useGetProfile();
  const { profile } = useSelector((state: RootState) => state.user);

  const onChangeCheckin = (date: Dayjs, dateString: string | string[]) => {
    setDateCheckin(date);
  };

  const onChangeCheckout = (date: Dayjs, dateString: string | string[]) => {
    setDateCheckout(date);
  };

  const handleChangeTypeSearch = (): void => {
    setTypeSearch(!typeSearch);
  };

  const handleSearch = (): void => {
    if (searchLocation !== "" && location) {
      router.push(`/search?keyword=${location}`);
      setCountMember(0);
      setSearchLocation("");
      setDateCheckin(null);
      setDateCheckout(null);
    } else {
      openNotification("warning", "Tìm kiếm", "Điểm đến không được bỏ trống");
    }
  };

  const handleChangeCountMember = (value: number): void => {
    setCountMember((prevCount) => prevCount + value);
  };

  useEffect(() => {
    setXValue(40);
    const login = checkIsLogin();

    if (login) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    if (profile.role === "ADMIN") {
      setXValue(100);
    } else {
      setXValue(40);
    }
  }, [profile]);

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
            x: isScroll ? 0 : xValue,
          }}
          initial={{ y: 50, x: xValue }}
          transition={{ duration: 0.5 }}
        >
          {isScroll === false ? (
            <>
              <div className="px-7 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer">
                <p className="text-[12px] font-medium">Địa điểm</p>
                <Dropdown
                  trigger={["click"]}
                  open={isOpenDropdown}
                  placement="bottom"
                  onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
                  dropdownRender={() => (
                    <HeaderModalLocation
                      searchLocation={searchLocation}
                      setIsOpenDropdown={setIsOpenDropdown}
                      setLocation={setLocation}
                      setSearchLocation={setSearchLocation}
                    />
                  )}
                >
                  <Input
                    allowClear
                    defaultValue={searchLocation}
                    value={searchLocation}
                    placeholder="Tìm kiếm điểm đến"
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                    }}
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
                  onChange={onChangeCheckin}
                  value={dateCheckin}
                  format={{
                    format: "YYYY-MM-DD",
                    type: "mask",
                  }}
                />
              </div>
              {typeSearch === false && (
                <div className="px-7 py-2 rounded-full hover:bg-custome-gray-100 cursor-pointer">
                  <p className="text-[12px] font-medium">Trả phòng</p>
                  <DatePicker
                    suffixIcon={false}
                    placeholder="Thêm ngày"
                    className="!py-0"
                    onChange={onChangeCheckout}
                    value={dateCheckout}
                    format={{
                      format: "YYYY-MM-DD",
                      type: "mask",
                    }}
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
                      <ModalCustomer
                        member={countMember}
                        handleChangeCountMember={handleChangeCountMember}
                      />
                    )}
                  >
                    <Input
                      placeholder="Tìm kiếm điểm đến"
                      value={countMember === 0 ? "" : countMember}
                    />
                  </Dropdown>
                </div>
                <div
                  onClick={handleSearch}
                  className="rounded-full bg-primary-100 w-10 h-10 top-0 right-0 flex items-center justify-center p-2 transition-all duration-500 ease-in-out hover:bg-primary-200"
                >
                  <FontAwesomeIcon
                    size="lg"
                    className="text-white"
                    icon={faMagnifyingGlass}
                  />
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
              <div className="bg-primary-100 m-1 w-10 h-10 rounded-full p-2 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out hover:bg-primary-200">
                <FontAwesomeIcon
                  size="lg"
                  className="text-white"
                  icon={faMagnifyingGlass}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </ConfigProvider>
  );
};

export default HeaderSearch;
