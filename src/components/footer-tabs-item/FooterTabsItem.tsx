import { FooterTabItemType } from "@/types/footer/footerTabItemType.type";
import { truncateString } from "@/utils/method/method";
import React from "react";

type Props = {
  item: FooterTabItemType;
};

const FooterTabItem: React.FC<Props> = ({ item }) => {
  return (
    <div className="w-[calc((100%-60px)/6)] cursor-pointer">
      <h1 className="text-black font-medium">{item.title}</h1>
      <p className="text-custome-gray-200">
        {truncateString(item.content, 20)}
      </p>
    </div>
  );
};

export default FooterTabItem;
