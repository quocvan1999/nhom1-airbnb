"use client";

import HeaderNav from "@/components/header-nav/HeaderNav";
import HeaderSearch from "@/components/header-search/HeaderSearch";
import useStatusHeader from "@/custome-hook/useStatusHeader/useStatusHeader";
import React from "react";

type Props = {};

const Header: React.FC<Props> = ({}) => {
  const { isScroll } = useStatusHeader();
  return (
    <div className="w-full border-b">
      <div
        className={`max-w-[1280px] px-2 mx-auto flex items-center justify-between py-3 transition-all duration-500 ease-in-out ${
          isScroll === false && "pb-[90px]"
        }`}
      >
        <div className="w-[110px]">
          <img src="/images/Airbnb_Logo.png" alt="logo" />
        </div>
        <HeaderSearch />
        <HeaderNav />
      </div>
    </div>
  );
};

export default Header;
