import LayoutAdminPage from "@/components/layout-admin-page/LayoutAdminPage";
import { ConfigProvider } from "antd";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            colorPrimary: "#FF385C",
          },
        },
        token: {
          colorPrimary: "#FF385C",
          colorLink: "#FF385C",
        },
      }}
    >
      <div className="w-full h-[100vh]">
        <LayoutAdminPage children={children} />
      </div>
    </ConfigProvider>
  );
}
