"use client";

import { AppDispatch, RootState } from "@/app/[locale]/globalRedux/store";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { CommentType } from "@/types/comment/comment.type";
import { RoomType } from "@/types/room/roomType.type";
import { randomNumber, roundToDecimal } from "@/utils/method/method";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  room: RoomType;
};

const listHost: string[] = [
  "Văn Thái",
  "Minh Phương",
  "Thị Hằng",
  "Quốc Cường",
  "Thị Thanh",
  "Văn An",
  "Thị Mai",
  "Mạnh Hùng",
  "Thanh Sơn",
  "Ngọc Hiếu",
  "Thị Lan",
  "Văn Khánh",
  "Phương Linh",
  "Quang Duy",
  "Ngọc Bảo",
  "Quốc Hưng",
  "Thị Hoa",
  "Văn Toàn",
  "Thanh Tú",
  "Hữu Phát",
];

const DetailHeaderHost: React.FC<Props> = ({ room }) => {
  const tDetailHeaderHost = useTranslations("DetailHeaderHost");
  const dispatch: AppDispatch = useDispatch();
  const [hostName, setHostName] = useState<string>("");
  const [commentCount, setCommentCount] = useState<number>(0);
  const { comments } = useSelector((state: RootState) => state.room);
  const [countRate, setCountRate] = useState<number>(0);

  const randomHost = (): void => {
    const num = randomNumber(20);

    setHostName(listHost[num]);
  };

  const getCommentToRoom = async (): Promise<void> => {
    const action = getCommentToRoomAsync(room.id);
    dispatch(action);
  };

  const setRatingRoom = (): number => {
    let rating: number = 0;
    if (commentCount && countRate) {
      rating = roundToDecimal(countRate / commentCount, 1);
    }

    return rating;
  };

  const setTypeHost = (): string => {
    const rating: number = setRatingRoom();
    let typeHost: string = "";

    if (rating >= 0 && rating <= 2) {
      typeHost = `${tDetailHeaderHost("typeHost.type1")}`;
    } else if (rating > 2 && rating < 4) {
      typeHost = `${tDetailHeaderHost("typeHost.type2")}`;
    } else if (rating >= 4) {
      typeHost = `${tDetailHeaderHost("typeHost.type3")}`;
    }

    return typeHost;
  };

  useEffect(() => {}, []);

  useEffect(() => {
    getCommentToRoom();
    randomHost();
  }, [room]);

  useEffect(() => {
    if (comments) {
      setCommentCount(comments.length);

      setCountRate(0);

      comments.map((item: CommentType) => {
        setCountRate((prev: number) => (prev += item.saoBinhLuan));
      });
    }
  }, [comments]);

  return (
    <div className="flex gap-4 items-center border-b py-3">
      <div className="w-[60px] h-[60px] relative rounded-full border flex items-center justify-center">
        <img
          src="https://picsum.photos/200"
          alt="avatar"
          className="rounded-full object-cover"
        />

        {setTypeHost() === "Chủ nhà siêu cấp" && (
          <div className="absolute right-[-8px] bottom-0 bg-white w-7 h-7 shadow-lg flex items-center justify-center rounded-full">
            <FontAwesomeIcon
              className="text-primary-100"
              size="lg"
              icon={faMedal}
            />
          </div>
        )}
      </div>
      <div className="text-center lg:text-start">
        <h1 className="font-bold text-base text-custome-black-100 text-center lg:text-start">
          {`${tDetailHeaderHost("content")}`}: {hostName}
        </h1>
        <div className="hidden lg:flex items-center gap-1">
          <p>{setTypeHost()}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailHeaderHost;
