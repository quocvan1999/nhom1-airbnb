import HeaderNav from "@/components/header-nav/HeaderNav";
import React from "react";

type Props = {};

const Header: React.FC<Props> = ({}) => {
  return (
    <div className="max-w-[1280px] px-2 mx-auto flex items-center justify-between py-3">
      <div className="w-[110px]">
        <img src="/images/Airbnb_Logo.png" alt="logo" />
      </div>
      <div>input search</div>
      <HeaderNav />
    </div>
  );
};

export default Header;
