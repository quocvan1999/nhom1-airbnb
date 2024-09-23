import CaroucelContainer from "@/components/caroucel-container/CaroucelContainer";
import Rooms from "@/components/rooms/Rooms";
import TitleH1 from "@/components/titleH1/TitleH1";
import { ItemHomeType } from "@/types/item-home/itemHomeType.type";
import { itemData } from "@/utils/home-data/itemHome.data";
import React from "react";

type Props = {
  searchParams: {
    page: string | number;
    size: string | number;
  };
};

const Home: React.FC<Props> = ({ searchParams }) => {
  return (
    <div>
      <CaroucelContainer />
      <div className="mt-10">
        <TitleH1 title="Trải nghiệm đã qua" />
        <Rooms page={searchParams.page} size={searchParams.size} />
      </div>
      <div className="mt-10">
        <TitleH1 title="Bất cứ ở đâu" />
        <div className="flex flex-wrap gap-3">
          {itemData.map((item: ItemHomeType, index: number) => (
            <div key={index} className="w-[calc((100%-36px)/4)]">
              <img
                src={item.image}
                alt="image"
                className="w-full h-[200px] object-cover rounded-2xl"
              />
              <h3 className="font-bold py-2">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
