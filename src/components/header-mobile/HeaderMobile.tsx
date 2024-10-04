"use client";

import HeaderModalLocation from "@/components/header-modal-location/HeaderModalLocation";
import { LocationType } from "@/types/location/locationType.type";
import { ConfigProvider, Dropdown, Input } from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const HeaderMobile: React.FC<Props> = ({}) => {
  const router: AppRouterInstance = useRouter();
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType>({
    hinhAnh: "",
    id: 0,
    quocGia: "",
    tenViTri: "",
    tinhThanh: "",
  });

  const handleSearch = (): void => {
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
        },
      }}
    >
      <div className="block md:hidden w-full px-2 py-3">
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
                  setIsOpenDropdown={setIsOpenDropdown}
                  setLocation={setLocation}
                />
              )}
            >
              <Input
                value={location.tenViTri}
                placeholder="Tìm kiếm điểm đến"
              />
            </Dropdown>
          </div>
          <div className=" pe-2 py-2 rounded-full cursor-pointer flex justify-between">
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
        </div>
      </div>
    </ConfigProvider>
  );
};

export default HeaderMobile;
