import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/app/globalRedux/provider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://nhom1-airbnb.vercel.app" />
      </head>
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
