import React, { useState } from "react";

type Props = {
  setTotalMember: React.Dispatch<React.SetStateAction<number>>;
};

type Members = {
  nguoiLon: number;
  treEm: number;
  emBe: number;
  thuCung: number;
};

const HeaderModalCustomer: React.FC<Props> = ({ setTotalMember }) => {
  const [members, setMembers] = useState<Members>({
    nguoiLon: 0,
    treEm: 0,
    emBe: 0,
    thuCung: 0,
  });

  const handleChangeMember = (type: number, value: number) => {
    setMembers((prev) => {
      switch (type) {
        case 0:
          if (prev.nguoiLon > 0 || value > 0) {
            return { ...prev, nguoiLon: prev.nguoiLon + value };
          }
          return prev;
        case 1:
          if (prev.treEm > 0 || value > 0) {
            return { ...prev, treEm: prev.treEm + value };
          }
          return prev;
        case 2:
          if (prev.emBe > 0 || value > 0) {
            return { ...prev, emBe: prev.emBe + value };
          }
          return prev;
        case 3:
          if (prev.thuCung > 0 || value > 0) {
            return { ...prev, thuCung: prev.thuCung + value };
          }
          return prev;
        default:
          return prev;
      }
    });

    const total =
      members.nguoiLon + members.emBe + members.treEm + members.thuCung;

    setTotalMember(total);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-3">
      {/* 1 */}
      <div className="py-3 border-b flex justify-between items-center gap-16">
        <div>
          <h3 className="font-bold">Người lớn</h3>
          <p>Từ 13 tuổi trở lên</p>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => handleChangeMember(0, 1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {members.nguoiLon}
          </div>
          <div
            onClick={() => handleChangeMember(0, -1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M5 11h14v2H5z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div className="py-3 border-b flex justify-between items-center gap-16">
        <div>
          <h3 className="font-bold">Trẻ em</h3>
          <p>Độ tuổi 2 – 12</p>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => handleChangeMember(1, 1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {members.treEm}
          </div>
          <div
            onClick={() => handleChangeMember(1, -1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M5 11h14v2H5z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 3 */}
      <div className="py-3 border-b flex justify-between items-center gap-16">
        <div>
          <h3 className="font-bold">Em bé</h3>
          <p>Dưới 2 tuổi</p>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => handleChangeMember(2, 1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {members.emBe}
          </div>
          <div
            onClick={() => handleChangeMember(2, -1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M5 11h14v2H5z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* 4 */}
      <div className="py-3 flex justify-between items-center gap-16">
        <div>
          <h3 className="font-bold">Thú cưng</h3>
        </div>
        <div className="flex items-center">
          <div
            onClick={() => handleChangeMember(3, 1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
            </svg>
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center">
            {members.thuCung}
          </div>
          <div
            onClick={() => handleChangeMember(3, -1)}
            className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              style={{ fill: "rgba(0, 0, 0, 1)" }}
            >
              <path d="M5 11h14v2H5z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderModalCustomer;
