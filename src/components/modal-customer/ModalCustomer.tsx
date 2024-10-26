"use client";

import ModalCustomerItem from "@/components/modal-customer-item/ModalCustomerItem";
import { ModalMemberType } from "@/types/modal-member/modalMemberType.type";
import React, { useEffect, useState } from "react";

type Props = {
  handleChangeCountMember: (value: number) => void;
  member: number;
};

const ModalCustomer: React.FC<Props> = ({
  handleChangeCountMember,
  member = 0,
}) => {
  const [data, setData] = useState<ModalMemberType[] | null>(null);

  const handleSetData = (): void => {
    if (member > 0) {
      const items: ModalMemberType[] = [
        {
          title: "Người lớn",
          content: "Từ 13 tuổi trở lên",
          defaultCount: member,
        },
        {
          title: "Trẻ em",
          content: "Độ tuổi 2 - 12",
          defaultCount: 0,
        },
        {
          title: "Em bé",
          content: "Dưới 2 tuổi",
          defaultCount: 0,
        },
        {
          title: "Thú cưng",
          content: "",
          defaultCount: 0,
        },
      ];
      setData(items);
    }
  };

  useEffect(() => {
    handleSetData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md py-5 px-4">
      {data &&
        data.map((item: ModalMemberType, index: number) => (
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
