import LayoutAdminPage from "@/components/layout-admin-page/LayoutAdminPage";
import { ConfigProvider } from "antd";
import React, { Suspense } from "react";

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
        <Suspense fallback={<div></div>}>
          <LayoutAdminPage children={children} />
        </Suspense>
      </div>
    </ConfigProvider>
  );
}
