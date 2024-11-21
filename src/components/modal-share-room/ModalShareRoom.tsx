"use client";

import { FacebookShareButton } from "react-share";
import { message, Modal } from "antd";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { RoomType } from "@/types/room/roomType.type";
import useCopyToClipboard from "@/custome-hook/useCopyToClipboard/useCopyToClipboard";
import { useTranslations } from "next-intl";

type Props = {
  url: string;
  isModalViewUserOpen: boolean;
  setIsModalViewUserOpen: React.Dispatch<React.SetStateAction<boolean>>;
  room: RoomType;
};

const ModalShareRoom: React.FC<Props> = ({
  isModalViewUserOpen,
  setIsModalViewUserOpen,
  url,
  room,
}) => {
  const tModalShareRoom = useTranslations("ModalShareRoom");
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const infoCopy = () => {
    message.success(`${tModalShareRoom("contentMessage")}`);
  };

  return (
    <Modal
      onCancel={() => {
        setIsModalViewUserOpen(false);
      }}
      width={400}
      footer={null}
      open={isModalViewUserOpen}
    >
      <div className="mt-5">
        <h1 className="font-bold text-lg">{tModalShareRoom("title")}</h1>
        <div className="flex items-start gap-3 mt-2 bg-custome-gray-100 p-2 rounded-lg">
          <img
            src={room.hinhAnh}
            alt="Hinh anh"
            className="w-[60px] h-[60px] rounded-lg object-cover"
          />
          <h1 className="font-bold">{room.tenPhong}</h1>
        </div>
      </div>
      <div className="flex items-center flex-wrap gap-3 mt-5">
        <div
          onClick={() => {
            copyToClipboard(url);
            infoCopy();
          }}
          className="w-[40px] h-[40px] justify-center border border-custome-gray-200 rounded-full py-2 px-4 font-semibold text-custome-gray-200 flex items-center gap-2 cursor-pointer group transition-all duration-500 ease-in-out hover:text-primary-100 hover:border-primary-100"
        >
          <FontAwesomeIcon
            size="lg"
            className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
            icon={faLink}
          />
        </div>

        <FacebookShareButton url={url}>
          <div className="w-[40px] h-[40px] justify-center border border-custome-gray-200 rounded-full py-2 px-4 font-semibold text-custome-gray-200 flex items-center gap-2 cursor-pointer group transition-all duration-500 ease-in-out hover:text-primary-100 hover:border-primary-100">
            <FontAwesomeIcon
              size="lg"
              className="text-custome-gray-200 transition-all duration-500 ease-in-out group-hover:text-primary-100"
              icon={faFacebookF}
            />
          </div>
        </FacebookShareButton>
      </div>
    </Modal>
  );
};

export default ModalShareRoom;
