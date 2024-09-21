import React from "react";

type Props = {};

const locations: string[] = [
  "Tây Ninh",
  "Hồ Chí Minh",
  "Long An",
  "Bình Dương",
];

const HeaderModalLocation: React.FC<Props> = ({}) => {
  return (
    <div className="w-full bg-white shadow-md rounded-lg p-3">
      {locations.map((location: string, index: number) => (
        <div className="flex items-center gap-3 py-2 cursor-pointer transition-all duration-500 ease-in-out hover:bg-custome-gray-100 px-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="14"
            width="10.5"
            viewBox="0 0 384 512"
          >
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
          <span>{location}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderModalLocation;
