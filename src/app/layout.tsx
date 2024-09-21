import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/footer/Footer";

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
      <body
        className={`${airbnbVF.className} text-[14px] text-custome-black-100`}
      >
        <div className="w-full">header</div>
        <div className="max-w-[1280px] mx-auto px-2">{children}</div>
        <div className="w-full bg-custome-gray-100">
          <Footer />
        </div>
      </body>
    </html>
  );
}
