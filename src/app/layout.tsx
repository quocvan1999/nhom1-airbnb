import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const airbnbVF = localFont({
  src: "./fonts/AirbnbCerealVF.woff2",
  variable: "--font-airbnb-vf",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-custom text-[14px] text-custome-black-100`}>
        <AntdRegistry>
          <div className="w-full">{children}</div>
        </AntdRegistry>
      </body>
    </html>
  );
}
