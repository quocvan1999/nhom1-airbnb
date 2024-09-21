import React from "react";

type Props = {};

const HeaderModalCustomer: React.FC<Props> = ({}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md p-3">
      {/* 1 */}
      <div className="py-3 border-b flex justify-between items-center gap-16">
        <div>
          <h3 className="font-bold">Người lớn</h3>
          <p>Từ 13 tuổi trở lên</p>
        </div>
        <div className="flex items-center">
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
            1
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
            1
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
            1
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
            1
          </div>
          <div className="w-[30px] h-[30px] flex items-center justify-center border rounded-full border-[#6a6a6a] transition-all duration-500 ease-in-out cursor-pointer hover:shadow-lg">
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
