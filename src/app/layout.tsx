import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/app/globalRedux/provider";
import "./globals.css";

export const metadata = {
  title:
    "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
  description:
    "Tìm kiếm cho thuê kỳ nghỉ, nhà gỗ, nhà bãi biển, nhà độc đáo và những trải nghiệm tuyệt vời trên toàn thế giới - tất cả đều do các chủ nhà trên Airbnb mang lại.",

  openGraph: {
    title:
      "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
    description:
      "Khám phá những chỗ ở tuyệt vời và những trải nghiệm độc đáo từ khắp nơi trên thế giới. Đặt chỗ cho cuộc phiêu lưu tiếp theo của bạn với Airbnb ngay hôm nay.",
    url: "https://nhom1-airbnb-test.vercel.app/",
    images: [
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-694055224756906854/original/76f85a0c-b3e2-4f1d-9aa9-d7838f2393c6.jpeg?im_w=960&im_q=highq",
        width: 800,
        height: 600,
        alt: "Cho thuê và trải nghiệm Airbnb",
      },
    ],
    type: "website",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
    description:
      "Tìm kiếm cho thuê kỳ nghỉ, nhà gỗ, nhà bãi biển, nhà độc đáo và những trải nghiệm trên toàn cầu trên Airbnb.",
    url: "https://www.airbnb.com.vn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-custom text-[14px] text-custome-black-100`}>
        <Providers>
          <AntdRegistry>
            <div className="w-full">{children}</div>
          </AntdRegistry>
        </Providers>
      </body>
    </html>
  );
}
