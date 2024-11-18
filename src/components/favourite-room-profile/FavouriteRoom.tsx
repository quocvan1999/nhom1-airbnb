"use client";

import { RootState } from "@/app/[locale]/globalRedux/store";
import Favourites from "@/components/favourites/Favourites";
import { getRoomDetailAsync } from "@/services/room-detail/roomDetail.service";
import { RoomType } from "@/types/room/roomType.type";
import { ConfigProvider, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {};

const FavouriteRoom: React.FC<Props> = ({}) => {
  const [favouriteRoom, setFavouriteRoom] = useState<RoomType[] | null>(null);
  const [roomId, setRoomId] = useState<number[] | null>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const { profile } = useSelector((state: RootState) => state.user);

  const getDetailRoom = (): void => {
    setFavouriteRoom(null);
    if (roomId !== null) {
      if (roomId.length > 0) {
        roomId.map(async (item: number) => {
          const data: RoomType = await getRoomDetailAsync(item);
          if (typeof data === "object") {
            setFavouriteRoom((prev) => (prev ? [...prev, data] : [data]));
          }
        });
      }
    }
  };

  const getFavouriteRoom = (): void => {
    const idRoom: number[] = JSON.parse(
      localStorage.getItem(
        `${process.env.NEXT_PUBLIC_NAME_STORAGE}-${profile.id}`
      ) || "[]"
    );

    if (idRoom.length > 0) {
      setRoomId(idRoom);
    } else {
      setRoomId(null);
    }
  };

  useEffect(() => {
    getFavouriteRoom();
  }, [isLoading]);

  useEffect(() => {
    if (roomId !== null) {
      getDetailRoom();
    } else {
      setFavouriteRoom(null);
    }
  }, [roomId]);

  return (
    <ConfigProvider theme={{ components: {} }}>
      {favouriteRoom && favouriteRoom !== null && favouriteRoom.length > 0 ? (
        <Favourites
          isLoading={isLoading}
          setIsLoading={setIsloading}
          rooms={favouriteRoom}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </ConfigProvider>
  );
};

export default FavouriteRoom;
