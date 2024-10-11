"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaArrowLeft } from "react-icons/fa";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import OperationsGraph from "@/components/OperationsGraph";
import axios from "axios";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const { RangePicker } = DatePicker;
const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [dateValue, setDateValue] = useState<string | string[]>(["2022-06-01", "2022-08-31"]);
  const [apiData, setApiData] = useState<any>(null);
  const [ppdLevelGraphData, setPpdLevelGraphData] = useState<any>([{ day: 10, PPDLEVEL: 100 }]);
  const [energyGraphData, setEnergyGraphData] = useState<any>([{ day: 10, energySaving: 100 }]);
  const [co2GraphData, setCo2GraphData] = useState<any>([{ day: 10, co2: 100 }]);
  const [defaultPickerValue, setDefaultPickerValue] = useState<any>([dayjs("2022-06-01"), dayjs("2022-06-31")]);
  const [percentageSliders, setPercentageSliders] = useState<{ energy: number; co2: number; PPD: number }>({
    energy: 20,
    co2: 45,
    PPD: 63,
  });

  useEffect(() => {
    const fetchGraphsData = async () => {
      const params = new URLSearchParams({
        startdate: dateValue[0],
        enddate: dateValue[1],
      });
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/plotGraph?${params.toString()}`);
      const newPPDArr: any = [];
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        newPPDArr.push({
          day: `${key.split("-")[1]}-${key.split("-")[2]}`,
          baseline: value.averPPD[0],
          rl: value.averPPD[1],
          label: key.split("-")[2],
        });
      });
      setPpdLevelGraphData(newPPDArr);
      const newEneryArr: any = [];
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        newEneryArr.push({
          day: `${key.split("-")[1]}-${key.split("-")[2]}`,
          baseline: value.sumEnergy[0],
          rl: value.sumEnergy[1],
          label: key.split("-")[2],
        });
      });
      setEnergyGraphData(newEneryArr);
      const newCO2Arr: any = [];
      Object.entries(data).forEach(([key, value]: [string, any]) => {
        newCO2Arr.push({
          day: `${key.split("-")[1]}-${key.split("-")[2]}`,
          baseline: value.aveZonC[0],
          rl: value.aveZonC[1],
          label: key.split("-")[2],
        });
      });
      setCo2GraphData(newCO2Arr);
      setApiData(data);
    };
    fetchGraphsData();
  }, [dateValue]);
  return (
    <div className="md:pt-[8%] pt-[20%] relative md:pb-0 pb-[50px]">
      <div
        onClick={() => router.push(`/${params.lang}/dashboard`)}
        className="absolute md:top-[7%] left-[3%] cursor-pointer text-text-gray hover:text-white transition-all duration-300"
      >
        <FaArrowLeft className="text-[22px]" />
      </div>
      <h1 className="md:text-4xl text-xl text-white text-center mb-[2%] font-bold">Digital Twin Screen</h1>
      <div className="w-[100%] md:w-[60%] mx-auto flex md:flex-row flex-col items-start justify-between mb-[2%]">
        <div className="w-[98%] mx-auto md:w-[45%]">
          <h2 className="md:text-xl text-[16px] mb-2 text-white font-bold">Objective Weighting Split</h2>
          <div className="w-full">
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[35%] border-[1px] px-2 py-2 text-sm whitespace-nowrap">Energy Savings:</p>{" "}
              <Slider
                max={100}
                step={1}
                min={0}
                className="w-[50%] py-2"
                onValueChange={(v) => setPercentageSliders({ ...percentageSliders, energy: v[0] })}
                defaultValue={[percentageSliders.energy]}
              />
              <p className="w-[10%] whitespace-nowrap">{percentageSliders.energy}%</p>
            </div>
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[35%] border-[1px] px-2 py-2 text-sm">PPD Level:</p>{" "}
              <Slider
                max={100}
                step={1}
                min={0}
                className="w-[50%] py-2"
                onValueChange={(v) => setPercentageSliders({ ...percentageSliders, PPD: v[0] })}
                defaultValue={[percentageSliders.PPD]}
              />
              <p className="w-[10%] whitespace-nowrap">{percentageSliders.PPD}%</p>
            </div>
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[35%] border-[1px] px-2 py-2 text-sm">CO2 Level:</p>{" "}
              <Slider
                max={100}
                step={1}
                min={0}
                className="w-[50%] py-2"
                onValueChange={(v) => setPercentageSliders({ ...percentageSliders, co2: v[0] })}
                defaultValue={[percentageSliders.co2]}
              />
              <p className="w-[10%] whitespace-nowrap">{percentageSliders.co2}%</p>
            </div>
          </div>
        </div>
        <div className="w-[98%] mx-auto md:w-[45%]">
          <h2 className="md:text-xl text-[16px] mb-2 text-white font-bold">Limiting Thresholds</h2>
          <div className="w-full">
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[65%] border-[1px] px-2 py-2 text-sm">Temperature Range (°C):</p>{" "}
              <div className="w-[35%] flex items-center">
                <Input className="bg-dark-blue" value={"20°C"} /> - <Input value={"26°C"} className="bg-dark-blue" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[65%] border-[1px] px-2 py-2 text-sm whitespace-nowrap">
                Daily Maximum Power Load (kW):
              </p>{" "}
              <Input value={"1416 kW"} className="bg-dark-blue w-[35%]" />
            </div>
            <div className="flex items-center justify-between w-full text-[#b8b8b9] mb-2">
              <p className="bg-dark-blue w-[65%] border-[1px] px-2 py-2 text-sm">Analysis Duration (minutes):</p>{" "}
              <Input value={"15 minutes"} className="bg-dark-blue w-[35%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-[95%] md:w-[30%] mx-auto flex flex-col items-start mb-[2%]">
        <h2 className="w-[100%] md:text-xl text-[16px] font-bold text-center text-white mb-[1%]">
          Graphs and trajectories
        </h2>
        <div className="w-[100%]">
          <Select
            defaultValue="All Floors"
            onValueChange={(v) => {
              if (v === "All Floors") {
                router.push(`/${params.lang}/building-data/${params.slug}`);
              } else {
                router.push(`/${params.lang}/building-data/${params.slug}/floor/${v.split(" ")[1]}`);
              }
            }}
          >
            <SelectTrigger className="notranslate w-full bg-button-blue text-bright-blue mt-1">
              <SelectValue defaultValue={"All Floors"} placeholder="All Floors" defaultChecked />
            </SelectTrigger>
            <SelectContent className="notranslate bg-dark-blue border-2 border-bright-blue">
              <SelectGroup className=" bg-dark-blue">
                <SelectLabel>Floors</SelectLabel>
                <SelectItem value="All Floors">All Floors</SelectItem>
                <SelectItem value="Floor 1">Floor 1</SelectItem>
                <SelectItem value="Floor 2">Floor 2</SelectItem>
                <SelectItem value="Floor 3">Floor 3</SelectItem>
                <SelectItem value="Floor 4">Floor 4</SelectItem>
                <SelectItem value="Floor 5">Floor 5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <RangePicker
            showSecond={false}
            defaultValue={[dayjs(dateValue[0]), dayjs(dateValue[1])]}
            value={[dayjs(dateValue[0]), dayjs(dateValue[1])]}
            minLength={6}
            onOpenChange={(open) => {
              if (open) {
                setDateValue(["2022-08-24", "2022-08-31"]);
                setDefaultPickerValue([dayjs("2022-06-01"), dayjs("2022-06-30")]);
              }
            }}
            defaultPickerValue={defaultPickerValue}
            onPanelChange={(dates) => {
              setDefaultPickerValue([dates[0], dayjs(dates[1]?.subtract(40, "day"))]);
            }}
            onCalendarChange={(dates) => {
              if (dates && dates[0]) {
                const startDate = dayjs(dates[0]);
                const endDate = dates[1] ? dayjs(dates[1]) : null;
                if (endDate && endDate.isBefore(startDate.add(7, "day"))) {
                  // Set end date to be 7 days ahead of start date if it's less than 7 days
                  setDateValue([startDate.format("YYYY-MM-DD"), startDate.add(7, "day").format("YYYY-MM-DD")]);
                } else {
                  setDateValue(dates.map((d: any) => d.format("YYYY-MM-DD")));
                }
              } else {
                setDateValue(dates.map((d: any) => d.format("YYYY-MM-DD")));
              }
            }}
            disabledDate={(current) => {
              if (dateValue && dateValue[0]) {
                const startDate = dayjs(dateValue[0]);
                if (current.isBefore(startDate) && startDate.format("YYYY-MM-DD") !== "2022-08-24") {
                  return true;
                }
                if (current.isAfter(startDate) && current.isBefore(startDate.add(7, "day"))) {
                  return true;
                }
              }

              return false;
            }}
            onChange={(value, dateString) => {
              if (dateString !== undefined) {
                setDateValue(dateString);
                if (dayjs(dateString[1]).isBefore(dayjs(dateString[0]))) {
                  setDateValue([dateString[1], dateString[0]]);
                } else if (dayjs(dateString[1]).isBefore(dayjs(dateString[0]).add(7, "day"))) {
                  setDateValue([dateString[0], dayjs(dateString[1]).add(7, "day").format("YYYY-MM-DD")]);
                } else {
                  setDateValue(dateString);
                }
              } else {
                setDateValue(["2022-06-01", "2022-08-31"]);
              }
            }}
            placeholder={["start date", "end date"]}
            minDate={dayjs("2022-06-01", "YYYY-MM-DD")}
            maxDate={dayjs("2022-08-31", "YYYY-MM-DD")}
            className="w-full mt-[15px] bg-button-blue p-5 h-[45px] border-[1px] border-border py-1 text-white hover:text-black"
          />
        </div>
      </div>

      <div className="w-[98%] md:w-[60%] mx-auto md:my-6 flex items-center justify-center flex-col">
        <OperationsGraph
          // chartConfig={energyGraphConfig}
          title="Energy Saving Trajectory (kW)"
          lineGraphData={energyGraphData}
          dataKey="energySaving"
          color="#00ff00"
        />
        <OperationsGraph
          // chartConfig={ppdLevelGraphConfig}
          title="PPD Level Trajectory (%)"
          lineGraphData={ppdLevelGraphData}
          dataKey="PPDLEVEL"
          color="#ff4d4d"
        />
        <OperationsGraph
          // chartConfig={co2GraphConfig}
          title="CO2 Level Trajectory (ppm)"
          dataKey="co2"
          lineGraphData={co2GraphData}
          color="#5000ff"
        />
      </div>
    </div>
  );
};

export default Page;
