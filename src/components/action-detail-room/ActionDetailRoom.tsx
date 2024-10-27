"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import ModalShareRoom from "@/components/modal-share-room/ModalShareRoom";
import useCheckLogin from "@/custome-hook/useCheckLogin/useCheckLogin";
import useNotification from "@/custome-hook/useNotification/useNotification";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { getLocationIdAsync } from "@/services/get-locationId/getLocationId.service";
import { LocationType } from "@/types/location/locationType.type";
import { ReqType } from "@/types/req/reqType.type";
import { RoomType } from "@/types/room/roomType.type";
import {
  faHeart,
  faMedal,
  faShare,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfigProvider } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  room: RoomType;
};

const ActionDetailRoom: React.FC<Props> = ({ room }) => {
  const pathname = usePathname(); // Lấy đường dẫn
  const dispatch: AppDispatch = useDispatch();
  const [isLike, setIsLike] = useState<boolean>(false);
  const [url, setUrl] = useState<string>("");
  const [location, setLocation] = useState<LocationType | null>(null);
  const [commentCount, setCommentCount] = useState<number>(0);
  const { comments } = useSelector((state: RootState) => state.room);
  const { openNotification } = useNotification();
  const [isModalViewUserOpen, setIsModalViewUserOpen] =
    useState<boolean>(false);
  const { checkIsLogin } = useCheckLogin();

  const getLikeRoom = (): void => {
    const listLikeRoom: number[] = JSON.parse(
      localStorage.getItem(`${process.env.NEXT_PUBLIC_NAME_STORAGE}`) || "[]"
    );

    const like = listLikeRoom.includes(room.id);

    if (like) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  };

  const likeRoom = (): void => {
    const login = checkIsLogin();

    if (login === true) {
      const listLikeRoom: number[] = JSON.parse(
        localStorage.getItem(`${process.env.NEXT_PUBLIC_NAME_STORAGE}`) || "[]"
      );

      const pushRoom = listLikeRoom.push(room.id);

      if (pushRoom) {
        localStorage.setItem(
          `${process.env.NEXT_PUBLIC_NAME_STORAGE}`,
          JSON.stringify(listLikeRoom)
        );
        openNotification(
          "success",
          "Yêu thích",
          "Thêm phòng vào mục yêu thích thành công"
        );
        setIsLike(true);
      }
    } else {
      openNotification(
        "warning",
        "Yêu thích",
        "Bạn phải đăng nhập để thêm phòng vào mục yêu thích"
      );
    }
  };

  const unlikeRoom = (): void => {
    const login = checkIsLogin();

    if (login === true) {
      const listLikeRoom: number[] = JSON.parse(
        localStorage.getItem(`${process.env.NEXT_PUBLIC_NAME_STORAGE}`) || "[]"
      );

      const updatedArray = listLikeRoom.filter((id) => id !== room.id);

      if (updatedArray) {
        localStorage.setItem(
          `${process.env.NEXT_PUBLIC_NAME_STORAGE}`,
          JSON.stringify(updatedArray)
        );
        openNotification(
          "success",
          "Yêu thích",
          "Xoá phòng khỏi mục yêu thích thành công"
        );
        setIsLike(false);
      }
    }
  };

  const getLocation = async (): Promise<void> => {
    const data: ReqType<LocationType> = await getLocationIdAsync(room.maViTri);

    if (typeof data.content === "object") {
      setLocation(data.content);
    }
  };

  const getCommentToRoom = async (): Promise<void> => {
    const action = getCommentToRoomAsync(room.id);
    dispatch(action);
  };

  const setRatingRoom = (): number => {
    let rating: number = 0;
    if (commentCount) {
      if (commentCount >= 7) {
        rating = 5;
      } else if (commentCount < 0) {
        rating = 0;
      } else {
        const ratings = (commentCount / 7) * 5;
        rating = Math.round(ratings);
      }
    }

    return rating;
  };

  const setTypeHost = (): string => {
    const rating: number = setRatingRoom();
    let typeHost: string = "";

    if (rating) {
      if (rating >= 0 && rating < 2) {
        typeHost = "Chủ nhà mới";
      } else if (rating >= 2 && rating < 4) {
        typeHost = "Chủ nhà kinh nghiệm";
      } else if (rating >= 4) {
        typeHost = "Chủ nhà siêu cấp";
      }
    }

    return typeHost;
  };

  const getUrl = (): void => {
    const fullURL: string = `${window.location.origin}${pathname}`;
    if (fullURL) {
      setUrl(fullURL);
    }
  };

  useEffect(() => {
    getLocation();
    getCommentToRoom();
    getLikeRoom();
    getUrl();
  }, [room]);

  useEffect(() => {
    if (comments) {
      setCommentCount(comments.length);
    }
  }, [comments]);

  return (
    <ConfigProvider theme={{ components: {} }}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mt-4 lg:mt-0 mb-5">
        <div className="flex items-start lg:items-center lg:gap-5 text-custome-gray-200">
          <div className="hidden lg:flex items-center gap-1">
            <FontAwesomeIcon className="text-primary-100" icon={faStar} />
            <p className="font-bold text-custome-black-100">
              {setRatingRoom()}
              <span className="font-normal text-custome-gray-200">
                {` (${commentCount} đánh giá)`}
              </span>
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-1">
            <FontAwesomeIcon className="text-primary-100" icon={faMedal} />
            <p>{setTypeHost()}</p>
          </div>
          <Link href={`/search?keyword=${location?.id}`} className="underline">
            {location &&
              `${location.tenViTri}, ${location.tinhThanh}, ${location.quocGia}`}
          </Link>
        </div>
        <div className="flex items-start gap-4 text-custome-gray-200">
          <div
            onClick={() => {
              setIsModalViewUserOpen(true);
            }}
            className="flex items-center gap-1 group cursor-pointer"
          >
            <FontAwesomeIcon
              className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
              size="lg"
              icon={faShare}
            />
            <p className="underline transition-all duration-500 ease-in-out group-hover:text-primary-100">
              Chia sẻ
            </p>
          </div>

          <div
            className="flex items-center gap-1 group cursor-pointer"
            onClick={() => {
              if (isLike) {
                unlikeRoom();
              } else {
                likeRoom();
              }
            }}
          >
            <FontAwesomeIcon
              className={`transition-all duration-500 ease-in-out group-hover:text-primary-100 ${
                isLike ? "text-primary-100" : "text-custome-gray-200"
              }`}
              size="lg"
              icon={faHeart}
            />
            <p className="underline transition-all duration-500 ease-in-out group-hover:text-primary-100">
              {isLike ? "Bỏ lưu" : "Lưu"}
            </p>
          </div>
        </div>
      </div>
      {isModalViewUserOpen && (
        <ModalShareRoom
          url={url}
          isModalViewUserOpen={isModalViewUserOpen}
          setIsModalViewUserOpen={setIsModalViewUserOpen}
          room={room}
        />
      )}
    </ConfigProvider>
  );
};

export default ActionDetailRoom;
