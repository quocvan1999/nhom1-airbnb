"use client";

import ModalCustomerItem from "@/components/modal-customer-item/ModalCustomerItem";
import { ModalMemberType } from "@/types/modal-member/modalMemberType.type";
import React from "react";

type Props = {
  handleChangeCountMember: (value: number) => void;
};

const items: ModalMemberType[] = [
  {
    title: "Người lớn",
    content: "Từ 13 tuổi trở lên",
  },
  {
    title: "Trẻ em",
    content: "Độ tuổi 2 - 12",
  },
  {
    title: "Em bé",
    content: "Dưới 2 tuổi",
  },
  {
    title: "Thú cưng",
    content: "",
  },
];

const ModalCustomer: React.FC<Props> = ({ handleChangeCountMember }) => {
  return (
    <div className="bg-white rounded-xl shadow-md py-5 px-4">
      {items.map((item: ModalMemberType, index: number) => (
        <ModalCustomerItem
          key={index}
          item={item}
          handleChangeCountMember={handleChangeCountMember}
        />
      ))}
    </div>
  );
};

export default ModalCustomer;
