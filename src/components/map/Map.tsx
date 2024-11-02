"use client";

import mapboxgl from "mapbox-gl";
import React, { useEffect, useRef, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-sdk/services/geocoding";
import { ReqType } from "@/types/req/reqType.type";
import { LocationType } from "@/types/location/locationType.type";
import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";

type Props = { keyword: string | number };

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_BOX || "";

// Biến lưu trữ bản đồ
let map: mapboxgl.Map | null = null;

const Map: React.FC<Props> = ({ keyword }) => {
  const [address, setAddress] = useState<string>("");
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const geocodingClient = MapboxGeocoder({ accessToken: mapboxgl.accessToken });

  const getLocation = async (): Promise<void> => {
    const res: ReqType<LocationType> = await getLocationIdAsync(
      Number(keyword)
    );

    if (typeof res.content === "object") {
      const addr: string = `${res.content.tenViTri}, ${res.content.tinhThanh}, ${res.content.quocGia}`;
      setAddress(addr);
    }
  };

  const displayLocation = async (address: string): Promise<void> => {
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: address,
          limit: 1,
        })
        .send();

      const features = response?.body?.features;
      if (features && features.length > 0) {
        const coordinates = features[0].center as [number, number];

        // Nếu bản đồ đã tồn tại, xóa nó trước khi tạo bản đồ mới
        if (map) {
          map.remove();
        }

        // Tạo bản đồ mới và lưu nó vào biến `map`
        map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: "mapbox://styles/mapbox/streets-v11",
          center: coordinates,
          zoom: 14,
        });

        // Thêm marker vào vị trí đã tìm thấy
        // const marker = new mapboxgl.Marker() // Tạo một marker mới
        //   .setLngLat(coordinates) // Đặt tọa độ cho marker
        //   .setPopup(new mapboxgl.Popup().setHTML(`<h3>${address}</h3>`)) // Thêm popup cho marker
        //   .addTo(map); // Thêm marker vào bản đồ

        // // Điều chỉnh bản đồ để bao quanh marker
        // map.fitBounds(
        //   [
        //     [coordinates[0] - 0.01, coordinates[1] - 0.01], // Góc dưới bên trái
        //     [coordinates[0] + 0.01, coordinates[1] + 0.01], // Góc trên bên phải
        //   ],
        //   { padding: 20 }
        // ); // Thêm padding để không bị chật chội
      } else {
        console.error("Không tìm thấy địa chỉ này.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa điểm từ Mapbox: ", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, [keyword]);

  useEffect(() => {
    if (address !== "") {
      displayLocation(address);
    }
  }, [address]);

  return <div ref={mapContainerRef} className="!w-full !h-[700px]" />;
};

export default Map;
