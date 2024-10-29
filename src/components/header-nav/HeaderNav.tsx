import HeaderUserContainer from "@/components/header-user-container/HeaderUserContainer";
import LinkAdminPage from "@/components/link-admin-page/LinkAdminPage";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge } from "antd";
import React from "react";

type Props = {};

const HeaderNav: React.FC<Props> = ({}) => {
  return (
    <div className="flex items-center">
      <LinkAdminPage />

      <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100 me-2">
        <Badge count={1}>
          <FontAwesomeIcon
            size="xl"
            className="text-custome-gray-200"
            icon={faBell}
          />
        </Badge>
      </div>

      <HeaderUserContainer />
    </div>
  );
};

export default HeaderNav;
