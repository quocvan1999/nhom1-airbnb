"use client";

import ModalCustomerItem from "@/components/modal-customer-item/ModalCustomerItem";
import { ModalMemberType } from "@/types/modal-member/modalMemberType.type";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

type Props = {
  handleChangeCountMember: (value: number) => void;
  member: number;
};

const ModalCustomer: React.FC<Props> = ({
  handleChangeCountMember,
  member = 0,
}) => {
  const tModal = useTranslations("ModalCustomer");
  const [data, setData] = useState<ModalMemberType[] | null>(null);

  const handleSetData = (): void => {
    const items: ModalMemberType[] = [
      {
        title: `${tModal("item1.title")}`,
        content: `${tModal("item1.content")}`,
        defaultCount: member,
      },
      {
        title: `${tModal("item2.title")}`,
        content: `${tModal("item2.content")}`,
        defaultCount: 0,
      },
      {
        title: `${tModal("item3.title")}`,
        content: `${tModal("item3.content")}`,
        defaultCount: 0,
      },
      {
        title: `${tModal("item4.title")}`,
        content: `${tModal("item4.content")}`,
        defaultCount: 0,
      },
    ];
    setData(items);
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
