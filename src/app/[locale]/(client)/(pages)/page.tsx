import CaroucelContainer from "@/components/caroucel-container/CaroucelContainer";
import Rooms from "@/components/rooms/Rooms";
import TitleH1 from "@/components/titleH1/TitleH1";
import { ItemHomeType } from "@/types/item-home/itemHomeType.type";
import { itemData, itemDataEn } from "@/utils/home-data/itemHome.data";
import { useLocale, useTranslations } from "next-intl";
import React from "react";

type Props = {
  searchParams: {
    page: string | number;
    size: string | number;
  };
  params: {
    locale: string;
  };
};

export const generateMetadata = async ({ params }: Props) => {
  const { locale } = params;
  return {
    title:
      "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
    description:
      "Tìm kiếm cho thuê kỳ nghỉ, nhà gỗ, nhà bãi biển, nhà độc đáo và những trải nghiệm tuyệt vời trên toàn thế giới - tất cả đều do các chủ nhà trên Airbnb mang lại.",

    openGraph: {
      title:
        "Airbnb - Cho thuê kỳ nghỉ, Nhà gỗ, Nhà bãi biển, Nhà độc đáo & Trải nghiệm",
      description:
        "Khám phá những chỗ ở tuyệt vời và những trải nghiệm độc đáo từ khắp nơi trên thế giới. Đặt chỗ cho cuộc phiêu lưu tiếp theo của bạn với Airbnb ngay hôm nay.",
      url: `https://nhom1-airbnb.vercel.app/${locale}`,
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
      url: `https://nhom1-airbnb.vercel.app/${locale}`,
    },
  };
};

const Home: React.FC<Props> = ({ searchParams }) => {
  const tHomePage = useTranslations("HomePage");
  const locale = useLocale();
  return (
    <div>
      <CaroucelContainer />
      <div className="mt-10">
        <TitleH1 title={tHomePage("title1")} />
        <Rooms page={searchParams.page} size={searchParams.size} />
      </div>
      <div className="mt-10">
        <TitleH1 title={tHomePage("title2")} />
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? itemData.map((item: ItemHomeType, index: number) => (
                <div
                  key={index}
                  className="w-full md:w-[calc((100%-12px)/2)] lg:w-[calc((100%-24px)/3)] xl:w-[calc((100%-36px)/4)]"
                >
                  <img
                    src={item.image}
                    alt="image"
                    className="w-full h-[200px] object-cover rounded-2xl"
                  />
                  <h3 className="font-bold py-2">{item.title}</h3>
                </div>
              ))
            : itemDataEn.map((item: ItemHomeType, index: number) => (
                <div
                  key={index}
                  className="w-full md:w-[calc((100%-12px)/2)] lg:w-[calc((100%-24px)/3)] xl:w-[calc((100%-36px)/4)]"
                >
                  <img
                    src={item.image}
                    alt="image"
                    className="w-full h-[200px] object-cover rounded-2xl"
                  />
                  <h3 className="font-bold py-2">{item.title}</h3>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
