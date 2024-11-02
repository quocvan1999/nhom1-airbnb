"use client";

import { getLocationAsync } from "@/services/location/location.service";
import { LocationType } from "@/types/location/locationType.type";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

type Props = {
  setLocation: React.Dispatch<
    React.SetStateAction<LocationType | null | undefined>
  >;
  setIsOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  searchLocation: string;
  setSearchLocation: React.Dispatch<React.SetStateAction<string>>;
};

const HeaderModalLocation: React.FC<Props> = ({
  setLocation,
  setIsOpenDropdown,
  searchLocation,
  setSearchLocation,
}) => {
  const [locations, setLocations] = useState<LocationType[]>([]);

  const getLocations = async (): Promise<void> => {
    const res: LocationType[] = await getLocationAsync(searchLocation);
    setLocations(res);
  };

  useEffect(() => {
    getLocations();
  }, [searchLocation]);

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-3 max-h-[400px] overflow-y-scroll scrollbar-hide">
      {locations &&
        locations?.map((location: LocationType, index: number) => (
          <div
            key={index}
            onClick={() => {
              setLocation(location);
              setSearchLocation(location.tenViTri);
              setIsOpenDropdown(false);
            }}
            className="flex items-center gap-3 py-2 cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100 px-2 rounded-lg"
          >
            <FontAwesomeIcon
              size="lg"
              className="text-custome-gray-200"
              icon={faLocationDot}
            />
            <span>{location.tenViTri}</span>
          </div>
        ))}
    </div>
  );
};

export default HeaderModalLocation;
