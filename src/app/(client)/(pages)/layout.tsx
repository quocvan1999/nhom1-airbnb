import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <div className="w-full fixed top-0 left-0 right-0 bg-white z-[200]">
        <Header />
      </div>
      <div className="max-w-[1280px] mx-auto px-2 pt-[160px] pb-[50px]">
        {children}
      </div>
      <div className="w-full bg-custome-gray-100">
        <Footer />
      </div>
    </div>
  );
}
