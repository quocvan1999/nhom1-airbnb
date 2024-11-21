"use client";

import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const HeaderTranslate: React.FC<Props> = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const pathName = usePathname();
  const router = useRouter();

  const handleLanguageChange = (locale: string): void => {
    const path = pathName.split("/").slice(2).join("/");
    router.push(`/${locale}/${path}`);
  };

  return (
    <Dropdown
      open={isOpenDropdown}
      onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
      dropdownRender={() => (
        <div className="bg-white shadow-lg rounded-lg">
          <div className="flex flex-col">
            <Button
              onClick={() => {
                setIsOpenDropdown(false);
                handleLanguageChange("vi");
              }}
              className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
            >
              Tiếng Việt
            </Button>
            <Button
              onClick={() => {
                setIsOpenDropdown(false);
                handleLanguageChange("en");
              }}
              className="!border-none hover:!bg-custome-gray-100 hover:!text-custome-black-100 !rounded-t-none"
            >
              English
            </Button>
          </div>
        </div>
      )}
      placement="bottomLeft"
      trigger={["click"]}
    >
      <div className="w-[40px] h-[40px] flex items-center justify-center transition-all duration-500 ease-in-out hover:bg-custome-gray-100 rounded-full cursor-pointer">
        <FontAwesomeIcon
          icon={faGlobe}
          className="text-custome-gray-200"
          size="lg"
        />
      </div>
    </Dropdown>
  );
};

export default HeaderTranslate;
