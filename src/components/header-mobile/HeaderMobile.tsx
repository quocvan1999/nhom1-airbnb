"use client";

import HeaderModalLocation from "@/components/header-modal-location/HeaderModalLocation";
import { LocationType } from "@/types/location/locationType.type";
import { toSlugWithId } from "@/utils/method/method";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider, Dropdown, Input } from "antd";
import { useLocale } from "next-intl";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const HeaderMobile: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const router: AppRouterInstance = useRouter();
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType | null>();
  const [searchLocation, setSearchLocation] = useState<string>("");

  const handleSearch = (): void => {
    if (searchLocation !== "" && location) {
      router.push(
        `/${locale}/search?vitri=${toSlugWithId(
          `${location.tenViTri}, ${location.tinhThanh}, ${location.quocGia}`,
          location.id
        )}`
      );
    }
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
        },
      }}
    >
      <div className="block mdc:hidden w-full px-2 py-3">
        <div className="flex justify-between border bg-white rounded-full shadow-sm">
          <div className="px-7 w-full py-2 rounded-full cursor-pointer">
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
          <div className=" pe-2 py-2 rounded-full cursor-pointer flex justify-between">
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
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HeaderMobile;
