import FooterTabItem from "@/components/footer-tabs-item/FooterTabsItem";
import { FooterTabItemType } from "@/types/footer/footerTabItemType.type";
import {
  tab1,
  tab1En,
  tab2,
  tab2En,
  tab3,
  tab3En,
  tab4,
  tab4En,
  tab5,
  tab5En,
  tab6,
  tab6En,
  tab7,
  tab7En,
} from "@/utils/footer-data/footer.data";
import { ConfigProvider, Tabs, TabsProps } from "antd";
import { useLocale } from "next-intl";
import React from "react";

type Props = {};

const FooterTabs: React.FC<Props> = ({}) => {
  const locale = useLocale();
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `${locale === "en" ? "Popular" : "Phổ biến"}`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab1.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab1En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "2",
      label: `${
        locale === "en" ? "Culture and arts" : "Văn hoá và nghệ thuật"
      }`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab2.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab2En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "3",
      label: `${locale === "en" ? "Outdoor" : "Ngoài trời"}`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab3.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab3En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "4",
      label: `${locale === "en" ? "Mountain" : "Dãy núi"}`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab4.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab4En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "5",
      label: `${locale === "en" ? "Beach" : "Bãi biển"}`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab5.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab5En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "6",
      label: `${locale === "en" ? "Category" : "Danh mục"}`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab6.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab6En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
    {
      key: "7",
      label: `${
        locale === "en" ? "Things to experience" : "Những điều nên trải nghiệm"
      }`,
      children: (
        <div className="flex flex-wrap gap-3">
          {locale === "vi"
            ? tab7.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))
            : tab7En.map((item: FooterTabItemType, index: number) => (
                <FooterTabItem key={index} item={item} />
              ))}
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            colorBorderSecondary: "#DDD",
            inkBarColor: "#222",
            itemColor: "#6A6A6A",
            itemHoverColor: "#222",
            itemSelectedColor: "#222",
          },
        },
      }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </ConfigProvider>
  );
};

export default FooterTabs;
