import HeaderNotificationClient from "@/components/header-notification-client/HeaderNotificationClient";
import HeaderUserContainer from "@/components/header-user-container/HeaderUserContainer";
import LinkAdminPage from "@/components/link-admin-page/LinkAdminPage";
import React from "react";

type Props = {};

const HeaderNav: React.FC<Props> = ({}) => {
  return (
    <div className="flex items-center">
      <LinkAdminPage />

      <HeaderNotificationClient type="destop" />
      <HeaderUserContainer />
    </div>
  );
};

export default HeaderNav;
