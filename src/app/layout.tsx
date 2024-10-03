import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/app/globalRedux/provider";
import "./globals.css";

export const metadata = {
  title:
    "Airbnb - Vacation Rentals, Cabins, Beach Houses, Unique Homes & Experiences",
  description:
    "Find vacation rentals, cabins, beach houses, unique homes and experiences around the world - all made possible by hosts on Airbnb.",

  openGraph: {
    title:
      "Airbnb - Vacation Rentals, Cabins, Beach Houses, Unique Homes & Experiences",
    description:
      "Discover amazing stays and unique experiences from all around the world. Book your next adventure with Airbnb today.",
    url: "https://nhom1-airbnb-test.vercel.app/",
    images: [
      {
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-694055224756906854/original/76f85a0c-b3e2-4f1d-9aa9-d7838f2393c6.jpeg?im_w=960&im_q=highq",
        width: 800,
        height: 600,
        alt: "Airbnb Rentals and Experiences",
      },
    ],
    type: "website",
  },
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Airbnb - Vacation Rentals, Cabins, Beach Houses, Unique Homes & Experiences",
    description:
      "Find vacation rentals, cabins, beach houses, unique homes and experiences worldwide on Airbnb.",
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
