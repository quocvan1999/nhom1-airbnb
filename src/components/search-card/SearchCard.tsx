"use client";

import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import {
  convertUSDToVND,
  toSlugWithId,
  truncateString,
} from "@/utils/method/method";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  item: RoomType;
};

const SearchCard: React.FC<Props> = ({ item }) => {
  const locale = useLocale();
  const tSearchPage = useTranslations("SearchPage");
  const [location, setLocation] = useState<LocationType | null>(null);

  const getLocation = async (): Promise<void> => {
    const res: ReqType<LocationType> = await getLocationIdAsync(item.maViTri);

    if (typeof res.content === "object") {
      setLocation(res.content);
    }
  };

  useEffect(() => {
    if (item) {
      getLocation();
    }
  }, [item]);
  return (
    <Link
      href={`/${locale}/room/${toSlugWithId(item.tenPhong, item.id)}`}
      className="flex flex-col md:flex-row md:h-[200px] md:gap-3 items-center py-5 border-b cursor-pointer"
    >
      <div className="w-full h-[200px] md:w-[35%] md:h-full">
        <img
          src={item.hinhAnh}
          alt="image"
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div className="w-full h-full flex md:w-[65%] flex-col justify-between">
        <div>
          <p className="text-custome-gray-200">
            {tSearchPage("SearchCart.title")} {location?.tenViTri}
          </p>
          <h1 className="text-[18px] font-medium text-custome-black-100">
            {truncateString(item.tenPhong, 100)}
          </h1>
          <hr className="w-[30px] my-3" />
          <p className="text-custome-gray-200">
            {`${item.khach} ${tSearchPage("SearchCart.guests")} - ${
              item.phongNgu
            } ${tSearchPage("SearchCart.bedrooms")} - ${
              item.giuong
            } ${tSearchPage("SearchCart.beds")} - ${
              item.phongTam
            } ${tSearchPage("SearchCart.baths")}`}
          </p>
          <p className="text-custome-gray-200">
            {item.wifi && `${tSearchPage("SearchCart.wifi")} - `}{" "}
            {item.tivi && `${tSearchPage("SearchCart.tivi")} - `}{" "}
            {item.banLa && `${tSearchPage("SearchCart.iron1")} - `}{" "}
            {item.banUi && `${tSearchPage("SearchCart.iron2")} - `}{" "}
            {item.bep && `${tSearchPage("SearchCart.kitchen")} - `}{" "}
            {item.dieuHoa && `${tSearchPage("SearchCart.airConditioning")} - `}{" "}
            {item.doXe &&
              `${tSearchPage("SearchCart.freeParkingOnPremises")} - `}
          </p>
        </div>
        <div className="text-end">
          <p className="text-custome-black-100 font-bold">
            {locale === "vi"
              ? convertUSDToVND(item.giaTien)
              : `${item.giaTien}$`}
            /
            <span className="font-normal">
              /{tSearchPage("SearchCart.night")}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SearchCard;
