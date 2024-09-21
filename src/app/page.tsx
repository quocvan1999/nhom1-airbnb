import CaroucelContainer from "@/components/caroucel-container/CaroucelContainer";
import Rooms from "@/components/rooms/Rooms";

export default function Home() {
  return (
    <div>
      <CaroucelContainer />
      <div className="mt-10">
        <Rooms />
      </div>
    </div>
  );
}
