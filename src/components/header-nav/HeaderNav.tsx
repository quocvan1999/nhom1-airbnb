import HeaderNotificationClient from "@/components/header-notification-client/HeaderNotificationClient";
import HeaderUserContainer from "@/components/header-user-container/HeaderUserContainer";
import LinkAdminPage from "@/components/link-admin-page/LinkAdminPage";
import React from "react";
import HeaderTranslate from "../header-translate/HeaderTranslate";

type Props = {};

const HeaderNav: React.FC<Props> = ({}) => {
  return (
    <div className="flex items-center">
      <LinkAdminPage />
      <HeaderTranslate />
      <HeaderNotificationClient type="destop" userType="client" />
      <HeaderUserContainer />
    </div>
  );
};

export default HeaderNav;
