import { getLocationAsync } from "@/services/location/location.service";
import { LocationType } from "@/types/location/locationType.type";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import React from "react";
import CaroucelItem from "@/components/caroucel-item/CaroucelItem";

type Props = {};

const CaroucelContainer: React.FC<Props> = async ({}) => {
  const data: LocationType[] = await getLocationAsync();

  return (
    <Carousel className="max-w-[250px] md:max-w-[600px] lg:max-w-[850px] xl:max-w-[1100px] mx-auto">
      <CarouselContent>
        {data.map((location: LocationType, index: number) => (
          <CaroucelItem key={index} location={location} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CaroucelContainer;
