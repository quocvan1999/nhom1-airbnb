import FooterTabItem from "@/components/footer-tabs-item/FooterTabsItem";
import { FooterTabItemType } from "@/types/footer/footerTabItemType.type";
import {
  tab1,
  tab2,
  tab3,
  tab4,
  tab5,
  tab6,
  tab7,
} from "@/utils/footer-data/footer.data";
import { ConfigProvider, Tabs, TabsProps } from "antd";
import React from "react";

type Props = {};

const FooterTabs: React.FC<Props> = ({}) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Phổ biến",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab1.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "Văn hoá và nghệ thuật",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab2.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "3",
      label: "Ngoài trời",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab3.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "4",
      label: "Dãy núi",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab4.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "5",
      label: "Bãi biển",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab5.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "6",
      label: "Danh mục",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab6.map((item: FooterTabItemType, index: number) => (
            <FooterTabItem key={index} item={item} />
          ))}
        </div>
      ),
    },
    {
      key: "7",
      label: "Những điều nên trải nghiệm",
      children: (
        <div className="flex flex-wrap gap-3">
          {tab7.map((item: FooterTabItemType, index: number) => (
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
