"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import { FaFan } from "react-icons/fa";
import { GiValve } from "react-icons/gi";
import { MdAir } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiThermometerHotBold } from "react-icons/pi";
import { WiHumidity } from "react-icons/wi";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const minSpeed = 10; // Minimum speed value
  const maxSpeed = 120; // Maximum speed value
  const minDuration = 0.3; // Minimum duration in seconds
  const maxDuration = 2; // Maximum duration in seconds
  const [HVACUnits] = useState([
    {
      name: "HVAC Unit 1",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 120,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
    {
      name: "HVAC Unit 2",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 50,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
    {
      name: "HVAC Unit 3",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 40,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
    {
      name: "HVAC Unit 4",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 70,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
    {
      name: "HVAC Unit 5",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 100,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
    {
      name: "HVAC Unit 6",
      items: [
        {
          name: "Fan",
          icon: <FaFan />,
          speed: 50,
        },
        {
          name: "AirDumper",
          icon: <MdAir />,
          speed: 120,
        },
        {
          name: "Hot Water Valve",
          icon: <GiValve />,
          speed: 120,
        },
      ],
    },
  ]);
  // const [currentActiveBuilding, setcurrentActiveBuilding] = useState(null);

  // useEffect(() => {
  //   const buildingsData = window.localStorage.getItem("buildingsData");
  //   const parsedBuildingsData = buildingsData ? JSON.parse(buildingsData) : [];
  //   parsedBuildingsData.map((item: any) => {
  //     if (item.name === String(params.slug).split("-").join(" ")) {
  //       console.log("item:", item);
  //       setcurrentActiveBuilding(item);
  //     }
  //   });
  // }, []);

  return (
    <div className="md:mt-[6.5%] mt-[20%] relative pb-3">
      <div
        onClick={() => router.push(`/${params.lang}`)}
        className="absolute top-0 left-[3%] cursor-pointer text-text-gray hover:text-white transition-all duration-300"
      >
        <FaArrowLeft className=" text-[22px]" />
      </div>
      <div className="w-full flex items-center justify-center flex-col">
        <h1 className="md:text-5xl text-2xl font-bold text-white mb-1">
          Building {String(params.slug)?.split("-").join(" ")}
        </h1>
        <p>Floor {params.num}</p>
        {/* <p className="text-text-gray flex items-center justify-center gap-x-3 gap-y-1 mt-[10px] flex-wrap w-[40%]">
          <span>Total Energy consumption:153KW</span>
          <span>No. of floors:28</span>
          <span>No. of HVAC:22</span>
          <span>PPD Levels:3.7%</span>
          <span>CO2 PPM: 453</span>
        </p> */}
        <Select
          defaultValue={`Floor ${params.num}`}
          onValueChange={(v) => {
            if (v === "All Floors") {
              router.push(`/${params.lang}/building-data/${params.slug}`);
            } else {
              router.push(`/${params.lang}/building-data/${params.slug}/floor/${v.split(" ")[1]}`);
            }
          }}
        >
          <SelectTrigger className="notranslate md:w-[20%] w-[96%] bg-button-blue text-bright-blue mt-1">
            <SelectValue defaultValue={`Floor ${params.num}`} placeholder={`Floor ${params.num}`} defaultChecked />
          </SelectTrigger>
          <SelectContent className="notranslate bg-dark-blue border-2 border-bright-blue">
            <SelectGroup className=" bg-dark-blue">
              <SelectLabel>Floors</SelectLabel>
              <SelectItem value="Floor 1">Floor 1</SelectItem>
              <SelectItem value="Floor 2">Floor 2</SelectItem>
              <SelectItem value="Floor 3">Floor 3</SelectItem>
              <SelectItem value="Floor 4">Floor 4</SelectItem>
              <SelectItem value="Floor 5">Floor 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="relative md:w-[50%] md:h-[80%] w-[98%] h-[99%] mx-auto md:mt-0 mt-[28%] pt-8">
        <Image src="/floorplan.svg" alt="floor" className="!w-full !h-full" width={1920} height={1080} />
        <div className="absolute top-[35%] left-[5%] w-[60%] h-[50%] flex flex-wrap justify-between">
          {HVACUnits.map((item, i) => (
            <div
              key={i}
              className="w-[26%] h-[20%] mb-4 mx-auto text-white text-xs flex items-center justify-center flex-col"
            >
              <p>{item.name}</p>
              <div className="flex items-center gap-x-2 w-full">
                {item.items.map((single, i) => (
                  <div key={i} className="flex flex-col items-center justify-between">
                    <div
                      className={`flex items-center justify-center cursor-pointer rounded-full md:md:w-[25px] w-[20px] md:h-[25px] h-[20px] ${
                        single.name === "Fan"
                          ? single.speed <= 40
                            ? "bg-green-500"
                            : single.speed >= 80
                            ? "bg-red-500"
                            : "bg-yellow-500"
                          : "bg-bright-blue"
                      }`}
                      key={i}
                    >
                      {single.name === "Fan" ? (
                        <span
                          className="animate-spin text-[15px]"
                          style={{
                            animationDuration: `${
                              maxDuration -
                              ((single.speed - minSpeed) / (maxSpeed - minSpeed)) * (maxDuration - minDuration)
                            }s`,
                          }}
                        >
                          {single.icon}
                        </span>
                      ) : (
                        <span>{single.icon}</span>
                      )}
                    </div>
                    <p className="mt-2 text-text-gray">{single.speed}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-2 absolute bottom-0 right-[4px] text-white text-xs flex items-center justify-center flex-col">
          <p>HVAC Unit 8</p>
          <div
            className={`flex items-center justify-center cursor-pointer rounded-full md:md:w-[25px] w-[20px] md:h-[25px] h-[20px] bg-green-500`}
          >
            <span
              className="animate-spin text-[15px]"
              style={{
                animationDuration: `${
                  maxDuration - ((43 - minSpeed) / (maxSpeed - minSpeed)) * (maxDuration - minDuration)
                }s`,
              }}
            >
              <FaFan />
            </span>
          </div>
          <p className="mt-2 text-text-gray">43</p>
        </div>

        <div className="mt-2 absolute bottom-0 left-[16px] text-white text-xs flex items-center justify-center flex-col">
          <div className="flex items-center justify-between gap-x-0">
            <div className="flex mb-[10px] gap-y-1 items-start justify-center flex-col">
              <IconContainer
                icon={<PiThermometerHotBold className="text-white" />}
                value={`32 °C`}
                backgroundColor="bg-bright-blue"
              />
              <IconContainer
                icon={<WiHumidity className="text-white text-[15px]" />}
                value={`76%`}
                backgroundColor="bg-green-500"
              />
            </div>
            <div className="flex mb-0 items-center justify-center flex-col">
              <p>HVAC Unit 7</p>
              <div
                className={`flex items-center justify-center cursor-pointer rounded-full md:md:w-[25px] w-[20px] md:h-[25px] h-[20px] bg-red-500`}
              >
                <span
                  className="animate-spin"
                  style={{
                    animationDuration: `${
                      maxDuration - ((113 - minSpeed) / (maxSpeed - minSpeed)) * (maxDuration - minDuration)
                    }s`,
                  }}
                >
                  <FaFan />
                </span>
              </div>
              <p className="mt-2 text-text-gray">113</p>
            </div>
          </div>
        </div>

        <div className="mb-2 absolute top-[8%] left-[16%] text-white text-xs flex items-center justify-center flex-col">
          <div className="flex items-center justify-between gap-x-0">
            <div className="flex items-start mb-[10px] flex-col justify-between gap-y-1">
              <IconContainer
                icon={<PiThermometerHotBold className="text-white" />}
                value={`32 °C`}
                backgroundColor="bg-bright-blue"
              />
              <IconContainer
                icon={<WiHumidity className="text-white text-[15px]" />}
                value={`76%`}
                backgroundColor="bg-green-500"
              />
            </div>
            <div className="flex mb-2 items-center justify-center flex-col">
              <p>HVAC Unit 9</p>
              <div
                className={`flex items-center justify-center cursor-pointer rounded-full md:md:w-[25px] w-[20px] md:h-[25px] h-[20px] bg-yellow-500`}
              >
                <span
                  className="animate-spin"
                  style={{
                    animationDuration: `${
                      maxDuration - ((76 - minSpeed) / (maxSpeed - minSpeed)) * (maxDuration - minDuration)
                    }s`,
                  }}
                >
                  <FaFan />
                </span>
              </div>
              <p className="mt-2 text-text-gray">76</p>
            </div>
          </div>
        </div>
        {/* temperatures and humidity, rooms */}
        <div className="absolute bottom-0 right-[11%] flex items-start flex-col gap-0 mb-[10px] gap-y-1">
          <IconContainer
            icon={<PiThermometerHotBold className="text-white" />}
            value={`32 °C`}
            backgroundColor="bg-bright-blue"
          />
          <IconContainer
            icon={<WiHumidity className="text-white text-[15px]" />}
            value={`76%`}
            backgroundColor="bg-green-500"
          />
        </div>
        {/* second room from the right */}
        <div className="absolute bottom-0 right-[23.5%] flex-col flex items-start gap-0 mb-[10px] gap-y-1">
          <IconContainer
            icon={<PiThermometerHotBold className="text-white" />}
            value={`32 °C`}
            backgroundColor="bg-bright-blue"
          />
          <IconContainer
            icon={<WiHumidity className="text-white text-[15px]" />}
            value={`76%`}
            backgroundColor="bg-green-500"
          />
        </div>

        {/* second room from the left */}
        <div className="absolute bottom-0 left-[25%] flex items-start flex-col gap-0 mb-[10px] gap-y-1">
          <IconContainer
            icon={<PiThermometerHotBold className="text-white" />}
            value={`32 °C`}
            backgroundColor="bg-bright-blue"
          />
          <IconContainer
            icon={<WiHumidity className="text-white text-[15px]" />}
            value={`76%`}
            backgroundColor="bg-green-500"
          />
        </div>

        {/* third room from the left */}
        <div className="absolute bottom-0 left-[36%] flex flex-col mb-[10px] items-start gap-y-1">
          <IconContainer
            icon={<PiThermometerHotBold className="text-white" />}
            value={`32 °C`}
            backgroundColor="bg-bright-blue"
          />
          <IconContainer
            icon={<WiHumidity className="text-white text-[15px]" />}
            value={`76%`}
            backgroundColor="bg-green-500"
          />
        </div>

        <div className="absolute top-[9%] right-[38%] flex flex-col items-center justify-between gap-2">
          <div className="flex flex-col items-start gap-y-2">
            {/* <p>Temperature</p> */}
            <div className="flex items-center gap-x-2 justify-center">
              <span className="flex items-center justify-center rounded-full md:h-[35px] md:w-[35px] h-[20px] w-[20px] bg-bright-blue">
                <PiThermometerHotBold className="text-white md:text-[26px] text-[12px]" />
              </span>
              <p className="text-bright-blue font-bold">32 °C</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-y-2">
            {/* <p>Humidity</p> */}
            <div className="flex items-center gap-x-2 justify-center">
              <span className="flex items-center justify-center rounded-full md:h-[35px] md:w-[35px] h-[20px] w-[20px] bg-green-500">
                <WiHumidity className="text-white md:text-[26px] text-[18px]" />
              </span>
              <p className="text-green-500 font-bold">70 %</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const IconContainer = ({ icon, value, backgroundColor }: { icon: any; value: any; backgroundColor?: string }) => {
  return (
    <div className="mb-0 text-white text-xs flex items-center justify-between mt-[5px]">
      <div
        className={`flex items-center justify-center cursor-pointer rounded-full md:md:w-[25px] w-[20px] md:h-[25px] h-[20px] ${backgroundColor}`}
      >
        <span className="md:text-[15px] text-[10px]">{icon}</span>
      </div>
      <p className="mt-0 text-text-gray text-center md:text-[12px] text-[10px] ml-1">{value}</p>
    </div>
  );
};
