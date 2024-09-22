import React from "react";

type Props = {
  title: string;
};

const TitleH1: React.FC<Props> = ({ title }) => {
  return (
    <h1 className="font-bold text-custome-black-100 text-[24px] py-3">
      {title}
    </h1>
  );
};

export default TitleH1;
