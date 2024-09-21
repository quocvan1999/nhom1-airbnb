import { getLocationAsync } from "@/services/location/location.service";
import { LocationType } from "@/types/location/locationType.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";

type Props = {};

const CaroucelContainer: React.FC<Props> = async ({}) => {
  const data: LocationType[] = await getLocationAsync();

  return (
    <Carousel className="max-w-[1200px] mx-auto">
      <CarouselContent>
        {data.map((location: LocationType, index: number) => (
          <CarouselItem
            key={index}
            className="basis-1/6 flex gap-4 cursor-pointer items-center"
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
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CaroucelContainer;
