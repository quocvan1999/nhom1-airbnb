"use client";

import HeaderNav from "@/components/header-nav/HeaderNav";
import HeaderSearch from "@/components/header-search/HeaderSearch";
import useStatusHeader from "@/custome-hook/useStatusHeader/useStatusHeader";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

type Props = {};

const Header: React.FC<Props> = () => {
  const locale = useLocale();
  const { isScroll } = useStatusHeader();

  return (
    <div className="hidden mdc:block w-full border-b">
      <div
        className={`max-w-[1280px] px-2 mx-auto flex items-center justify-between py-3 transition-all duration-500 ease-in-out ${
          isScroll === false && "pb-[90px]"
        }`}
      >
        <Link href={`/${locale}`} className="w-[110px]">
          <img src="/images/Airbnb_Logo.png" alt="logo" />
        </Link>
        <HeaderSearch />
        <HeaderNav />
      </div>
    </div>
  );
};

export default Header;
