"use client";

import { RoomType } from "@/types/room/roomType.type";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef } from "react";

type Props = { data: RoomType[] };

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX || "";

const Map: React.FC<Props> = ({ data }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [106.660172, 10.762622],
      zoom: 12,
    });
    return () => map.remove();
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "700px" }} />
  );
};

export default Map;
