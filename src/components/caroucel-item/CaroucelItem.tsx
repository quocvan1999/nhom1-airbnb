import { CarouselItem } from "@/components/ui/carousel";
import { LocationType } from "@/types/location/locationType.type";
import { toSlugWithId } from "@/utils/method/method";
import { useLocale } from "next-intl";
import Link from "next/link";
import React from "react";

type Props = {
  location: LocationType;
};

const CaroucelItem: React.FC<Props> = ({ location }) => {
  const locale = useLocale();
  return (
    <CarouselItem className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
      <Link
        className="flex gap-4 cursor-pointer items-center"
        href={`/${locale}/search?vitri=${toSlugWithId(
          `${location.tenViTri}, ${location.tinhThanh}, ${location.quocGia}`,
          location.id
        )}`}
      >
        <img
          src={location.hinhAnh}
          alt="image"
          className="w-14 h-14 rounded-lg"
        />
        <div>
          <h1 className="font-bold text-custome-black-100">
            {location.tenViTri}
          </h1>
          <p className="text-custome-gray-200 font-medium">
            {location.tinhThanh}
          </p>
        </div>
      </Link>
    </CarouselItem>
  );
};

export default CaroucelItem;
