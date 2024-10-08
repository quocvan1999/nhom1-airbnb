import LayoutAdminPage from "@/components/layout-admin-page/LayoutAdminPage";
import React from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[100vh]">
      <LayoutAdminPage children={children} />
    </div>
  );
}
