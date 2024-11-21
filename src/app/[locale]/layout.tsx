import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Providers } from "@/app/[locale]/globalRedux/provider";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import "./globals.css";

config.autoAddCss = false;

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="canonical" href="https://nhom1-airbnb.vercel.app" />
      </head>
      <body className={`font-custom text-[14px] text-custome-black-100`}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AntdRegistry>
              <div className="w-full">{children}</div>
            </AntdRegistry>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
