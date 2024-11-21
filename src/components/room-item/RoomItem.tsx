import { RoomType } from "@/types/room/roomType.type";
import {
  convertUSDToVND,
  toSlugWithId,
  truncateString,
} from "@/utils/method/method";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

type Props = {
  data: RoomType;
};

const RoomItem: React.FC<Props> = ({ data }) => {
  const locale = useLocale();
  const tSearchPage = useTranslations("SearchPage");
  return (
    <Link
      href={`/${locale}/room/${toSlugWithId(data.tenPhong, data.id)}`}
      className="w-full cursor-pointer md:w-[calc((100%-12px)/2)] lg:w-[calc((100%-24px)/3)] xl:w-[calc((100%-36px)/4)]"
    >
      <img
        src={data.hinhAnh}
        alt="hinh anh"
        className="w-full h-[270px] object-cover rounded-2xl"
      />
      <div className="mt-3">
        <h1 className="text-custome-black-100 font-bold">
          {truncateString(data.tenPhong, 30)}
        </h1>
        <p className="mt-1 text-custome-gray-200">
          {truncateString(data.moTa, 60)}
        </p>
        <p className="text-custome-black-100 font-bold">
          {locale === "vi" ? convertUSDToVND(data.giaTien) : `${data.giaTien}$`}
          /{tSearchPage("SearchCart.night")}
        </p>
      </div>
    </Link>
  );
};
export default RoomItem;
