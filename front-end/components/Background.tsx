import Image from "next/image";
import worldmap from "@/assets/images/worldmpa.png";

const Background = () => {
  return (
    <div className="min-w-full overflow-hidden z-[-4] h-screen fixed top-0 right-0">
      <Image src={worldmap} alt="worldmap" className="h-full md:w-auto object-cover" />
      <div className="w-full h-screen fixed top-0 right-0 bg-[#131c27f1]"></div>
    </div>
  );
};

export default Background;
