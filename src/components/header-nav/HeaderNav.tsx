import { Dropdown, MenuProps } from "antd";
import Link from "next/link";
import React from "react";

type Props = {};

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <Link href="/auth/login">Đăng nhập</Link>,
  },
  {
    key: "2",
    label: <Link href="/auth/register">Đăng xuất</Link>,
  },
];

const HeaderNav: React.FC<Props> = ({}) => {
  return (
    <div className="flex items-center">
      <Link
        href="#"
        className="font-medium text-custome-black-100 px-5 py-2 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100"
      >
        Cho thuê chỗ ở qua Airbnb
      </Link>

      <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100 me-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          style={{ fill: "#222" }}
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm7.931 9h-2.764a14.67 14.67 0 0 0-1.792-6.243A8.013 8.013 0 0 1 19.931 11zM12.53 4.027c1.035 1.364 2.427 3.78 2.627 6.973H9.03c.139-2.596.994-5.028 2.451-6.974.172-.01.344-.026.519-.026.179 0 .354.016.53.027zm-3.842.7C7.704 6.618 7.136 8.762 7.03 11H4.069a8.013 8.013 0 0 1 4.619-6.273zM4.069 13h2.974c.136 2.379.665 4.478 1.556 6.23A8.01 8.01 0 0 1 4.069 13zm7.381 6.973C10.049 18.275 9.222 15.896 9.041 13h6.113c-.208 2.773-1.117 5.196-2.603 6.972-.182.012-.364.028-.551.028-.186 0-.367-.016-.55-.027zm4.011-.772c.955-1.794 1.538-3.901 1.691-6.201h2.778a8.005 8.005 0 0 1-4.469 6.201z"></path>
        </svg>
      </div>

      <Dropdown menu={{ items }} placement="bottom" trigger={["click"]}>
        <div className="border flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-all duration-500 ease-in-out hover:shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            style={{ fill: "#222" }}
          >
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            style={{ fill: "#222" }}
          >
            <path d="M12 2C6.579 2 2 6.579 2 12s4.579 10 10 10 10-4.579 10-10S17.421 2 12 2zm0 5c1.727 0 3 1.272 3 3s-1.273 3-3 3c-1.726 0-3-1.272-3-3s1.274-3 3-3zm-5.106 9.772c.897-1.32 2.393-2.2 4.106-2.2h2c1.714 0 3.209.88 4.106 2.2C15.828 18.14 14.015 19 12 19s-3.828-.86-5.106-2.228z"></path>
          </svg>
        </div>
      </Dropdown>
    </div>
  );
};

export default HeaderNav;
