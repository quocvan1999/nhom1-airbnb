"use client";

import { ModalMemberType } from "@/types/modal-member/modalMemberType.type";
import React, { useEffect, useState } from "react";

type Props = {
  item: ModalMemberType;
  handleChangeCountMember: (value: number) => void;
};

const ModalCustomerItem: React.FC<Props> = ({
  item,
  handleChangeCountMember,
}) => {
  const [count, setCount] = useState<number>(0);

  const handleClick = (value: number): void => {
    setCount((prev) => {
      if (prev > 0 || value > 0) {
        return prev + value;
      }
      return prev;
    });
    if (value === -1) {
      if (count > 0) {
        handleChangeCountMember(value);
      }
    } else {
      if (count >= 0) {
        handleChangeCountMember(value);
      }
    }
  };

  useEffect(() => {
    if (item) {
      setCount(item.defaultCount);
    }
  }, []);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h3 className="font-bold text-custome-black-100">{item.title}</h3>
        <p className="text-custome-gray-200">{item.content}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleClick(1)}
          className="w-[35px] h-[35px] rounded-full border transition-all duration-500 ease-in-out hover:shadow-md flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{ fill: "#222" }}
          >
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg>
        </button>

        <div className="w-[35px] h-[35px] flex items-center justify-center">
          {count}
        </div>

        <button
          onClick={() => handleClick(-1)}
          className="w-[35px] h-[35px] rounded-full border transition-all duration-500 ease-in-out hover:shadow-md flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{ fill: "#222" }}
          >
            <path d="M5 11h14v2H5z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalCustomerItem;
