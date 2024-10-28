"use client";

import { AppDispatch, RootState } from "@/app/globalRedux/store";
import { getCommentToRoomAsync } from "@/services/comments-room/commentToRoom.service";
import { RoomType } from "@/types/room/roomType.type";
import { randomNumber } from "@/utils/method/method";
import { faMedal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  const dispatch: AppDispatch = useDispatch();
  const [hostName, setHostName] = useState<string>("");
  const [commentCount, setCommentCount] = useState<number>(0);
  const { comments } = useSelector((state: RootState) => state.room);

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

  useEffect(() => {}, []);

  useEffect(() => {
    getCommentToRoom();
    randomHost();
  }, [room]);

  useEffect(() => {
    if (comments) {
      setCommentCount(comments.length);
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

        <div className="absolute right-[-8px] bottom-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{ fill: "#FF385C" }}
          >
            <path d="M17 2h-4v4.059a8.946 8.946 0 0 1 4 1.459V2zm-6 0H7v5.518a8.946 8.946 0 0 1 4-1.459V2zm1 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm-1.225-8.519L12 11l1.225 2.481 2.738.397-1.981 1.932.468 2.727L12 17.25l-2.449 1.287.468-2.727-1.981-1.932 2.737-.397z"></path>
          </svg>
        </div>
      </div>
      <div className="text-center lg:text-start">
        <h1 className="font-bold text-base text-custome-black-100 text-center lg:text-start">
          Chủ nhà/Người tổ chức: {hostName}
        </h1>
        <div className="hidden lg:flex items-center gap-1">
          <FontAwesomeIcon className="text-primary-100" icon={faMedal} />
          <p>{setTypeHost()}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailHeaderHost;
