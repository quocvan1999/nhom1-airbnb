import Footer from "@/components/footer/Footer";
import HeaderMobile from "@/components/header-mobile/HeaderMobile";
import Header from "@/components/header/Header";
import LiveChat from "@/components/live-chat/LiveChat";
import NavMobile from "@/components/nav-mobile/NavMobile";
import { ConfigProvider } from "antd";

export default function ClientLayout({
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
          Button: {
            colorPrimary: "#FF385C",
          },
        },
        token: {
          colorPrimary: "#FF385C",
          colorLink: "#FF385C",
        },
      }}
    >
      <div className="w-full">
        <LiveChat />
        <div className="w-full fixed top-0 left-0 right-0 bg-white z-[200]">
          <Header />
          <HeaderMobile />
        </div>
        <div className="block mdc:hidden w-full fixed bottom-0 left-0 right-0 bg-white z-[200]">
          <NavMobile />
        </div>
        <div className="max-w-[1280px] mx-auto px-2 pt-[100px] mdc:pt-[160px] pb-[50px]">
          {children}
        </div>
        <div className="w-full bg-custome-gray-100">
          <Footer />
        </div>
      </div>
    </ConfigProvider>
  );
}
