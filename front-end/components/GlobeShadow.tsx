import shadow from "../assets/SVG/shadow.svg";
import Image from "next/image";

const GlobeShadow = () => {
  return (
    <>
      <Image src={shadow} alt="shadow" className="md:block hidden fixed z-[-2] left-[26%] top-[80%] w-[48%]" />
    </>
  );
};

export default GlobeShadow;
