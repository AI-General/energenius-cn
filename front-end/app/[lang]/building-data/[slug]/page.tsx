"use client";
import { Card, CardContent } from "@/components/ui/card";
import DonutPieChart from "@/components/DonutPieChart";
import RegularPieChart from "@/components/RegularPieChart";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { ChartConfig } from "@/components/ui/chart";
import { FaArrowLeft } from "react-icons/fa";
import { DatePicker, Select as AntSelect, Divider, Input } from "antd";
import type { InputRef } from "antd";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import axios from "axios";
import LineChart from "@/components/LineChart";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);
  const [currentlySelectedGraphValue, setCurrentlySelectedGraphValue] = useState(1);

  const NonHVAC = {
    Total: {
      label: "Total",
    },
    racks: {
      label: "Racks",
      color: "#172554",
    },
    storage: {
      label: "Storage",
      color: "#1e40af",
    },
    network_devices: {
      label: "Network Devices",
      color: "#2563eb",
    },
    cooling: {
      label: "cooling",
      color: "#2dabff",
    },
  } satisfies ChartConfig;

  const regularChartData = [
    { name: "Lighting", Total: 15, fill: "#4682b4" },
    { name: "Storage", Total: 30, fill: "#1e90ff" },
    { name: "Elevators", Total: 25, fill: "#87ceeb" },
    { name: "Other Electrical Appliances", Total: 25, fill: "#87cefa" },
    { name: "Building Envelope", Total: 5, fill: "#add8e6" },
  ];

  const pieChartConfig = {
    Total: {
      label: "Total",
    },
    HVAC: {
      label: "HVACE",
      color: "#2dabff",
    },
    Non_HVAC: {
      label: "Non HVACE",
      color: "#102E41",
    },
  } satisfies ChartConfig;

  const pieChartData = [
    { type: "HVAC", Total: 45, fill: "var(--color-HVAC)" },
    { type: "Non-HVAC", Total: 55, fill: "var(--color-Non_HVAC)" },
  ];

  return (
    <div className="md:mt-[7%] mt-[20%] relative">
      <div
        onClick={() => router.push(`/${params.lang}`)}
        className="absolute top-0 left-[3%] cursor-pointer text-text-gray hover:text-white transition-all duration-300"
      >
        <FaArrowLeft className=" text-[22px]" />
      </div>
      <Button className="absolute top-[-0.5%] md:top-0 right-[1.5%] md:right-[3%] cursor-pointer transition-all duration-300">
        <Link href={`/${params.lang}/building-data/${params.slug}/operations`}>Operations</Link>
      </Button>
      <div className="w-full flex items-center justify-center flex-col">
        <h1 className="md:text-5xl text-2xl md:mt-0 mt-[45px] font-bold text-white mb-1">
          {String(params.slug).split("-").join(" ")}
        </h1>
        <p className="text-text-gray flex items-center justify-center gap-x-3 gap-y-1 mt-[10px] flex-wrap md:w-[40%] w-[95%]">
          <span>Total Energy Consumption: 153kW</span>
          <span>Number of floors: 28</span>
          <span>Number of HVAC: 22</span>
          <span>PPD: 3.7%</span>
          <span>CO2 Level: 453 ppm</span>
        </p>
        <Select
          defaultValue="All Floors"
          onValueChange={(v) => {
            if (v === "All Floors") {
              router.push(`/${params.lang}/building-data/${params.slug}`);
            } else {
              router.push(`/${params.lang}/building-data/${params.slug}/floor/${v}`);
            }
          }}
        >
          <SelectTrigger className="notranslate md:w-[20%] w-[95%] bg-button-blue text-bright-blue mt-1">
            <SelectValue defaultValue={"All Floors"} placeholder="All Floors" defaultChecked />
          </SelectTrigger>
          <SelectContent className="notranslate bg-dark-blue border-2 border-bright-blue">
            <SelectGroup className=" bg-dark-blue">
              <SelectLabel>Floors</SelectLabel>
              <SelectItem value="All Floors">All Floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
              <SelectItem value="4">Floor 4</SelectItem>
              <SelectItem value="5">Floor 5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-between items-stretch mt-5 md:w-[85vw] w-[98vw] md:flex-row flex-col h-auto mx-auto">
        <div className="md:w-[44%] w-[100%] h-[100%] flex items-center justify-between flex-col md:gap-5 gap-2">
          <DonutPieChart
            ChartConfig={pieChartConfig}
            chartData={pieChartData}
            title="Energy Consumption Breakdown (%)"
          />
          <RegularPieChart ChartConfig={NonHVAC} chartData={regularChartData} title="Non-HVAC Energy Breakdown (%)" />
        </div>
        <PowerUsageEffectiveness apiData={apiData} setApiData={setApiData} />
      </div>

      <Card className="flex items-center relative justify-around md:w-[85vw] flex-wrap w-[98vw] py-9 mx-auto my-2 bg-dark-blue border">
        <h1 className="text-xl absolute whitespace-nowrap md:top-[5px] top-[10px] font-bold left-1/2 transform -translate-x-1/2 text-white">
          Energy Costs Comparision
        </h1>
        {apiData !== null && (
          <>
            <BottomText
              amount={`${apiData?.energyConsumption[0][0].toFixed(2) * 1}`}
              units={true}
              text="Baseline Power Usage"
              color="text-white"
            />
            <BottomText
              amount={`${apiData?.energyConsumption[1][0].toFixed(2)}`}
              text="Optimized Power Usage"
              units={true}
              color={
                apiData?.energyConsumption[0][0] < apiData?.energyConsumption[1][0] ? "text-red-600" : "text-green-600"
              }
            />
            <BottomText
              amount={`${apiData?.energyConsumption[0][0].toFixed(2) * 1}`}
              dollarSign={true}
              text="Baseline Power Cost"
              color="text-white"
            />
            <BottomText
              amount={`${apiData?.energyConsumption[1][0].toFixed(2)}`}
              text="Optimized Power Cost"
              dollarSign={true}
              color={
                apiData?.energyConsumption[0][0] < apiData?.energyConsumption[1][0] ? "text-red-600" : "text-green-600"
              }
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Page;

const PowerUsageEffectiveness = ({ apiData, setApiData }: { apiData: any; setApiData: any }) => {
  const [dateValue, setDateValue] = useState<string | string[]>("2022-06-02 00:00");
  const data: {
    text: string;
    value: string;
    type: string;
  }[] = [
    {
      text: "Energy Efficiency Ratio (EER)",
      value: "12%",
      type: "metric",
    },
    {
      text: "Seasonal Energy Efficiency Ratio (SEER)",
      value: "12%",
      type: "metric",
    },
    {
      text: "Under-Performing Units",
      value: "12",
      type: "metric",
    },
    {
      text: "Maintenance Alerts",
      value: "12",
      type: "metric",
    },
    // {
    //   text: "List of units needed maintenance",
    //   value: "25",
    //   type: "alert",
    // },
  ];
  const [selectOptions, setSelectOptions] = useState([
    {
      label: "Daily",
      value: "daily",
    },
    {
      label: "Weekly",
      value: "weekly",
    },
  ]);
  const [numberOfDays, setNumberOfDays] = useState("");
  const [dropDownPeriodValue, setDropDownPeriodValue] = useState("1");
  const inputRef = useRef<InputRef>(null);
  const [lineGraphTitle, setLineGraphTitle] = useState("Energy Consumption (W)");
  const [lineGraphData, setLineGraphData] = useState<any>([]);
  const [currentlySelectedGraphValue, setCurrentlySelectedGraphValue] = useState(1);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumberOfDays(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (numberOfDays.length > 0) {
      setSelectOptions([
        ...selectOptions,
        {
          label: `${numberOfDays} days`,
          value: `${numberOfDays} days`,
        },
      ]);
      setNumberOfDays("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else {
      alert;
    }
  };

  const getActivePeriodValues = async () => {
    const params = new URLSearchParams({
      datetime: `${dateValue}:00`,
      period: dropDownPeriodValue,
    });
    try {
      const data = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/getValues?${params.toString()}`);
      setApiData(data.data);
    } catch (error) {
      // setApiData(null);
      console.log("error:", error);
    }
  };

  useEffect(() => {
    // setInitailRender(false);
    if (dateValue.length > 0) {
      getActivePeriodValues();
    }
  }, [dateValue, dropDownPeriodValue]);

  return (
    <Card className="bg-dark-blue md:w-[55.5%] w-[98vw] h-full pt-5 pl-1 px-0 mx-auto md:mt-0 mt-[20px]">
      <CardContent className="md:px-4 px-4">
        <h1 className="text-xl text-white mb-2 font-bold">
          {/* Active period between{" "} */}
          {dateValue.includes("2022-06-01")
            ? //@ts-ignore
              `${dayjs(dateValue).format("MMM DD, YYYY")} - ${dayjs(dateValue)
                .add(Number(dropDownPeriodValue), "day")
                .format("MMM DD, YYYY")}`
            : // @ts-ignore
              `${dayjs(dateValue).subtract(Number(dropDownPeriodValue), "day").format("MMM DD, YYYY")} ${
                // @ts-ignore
                dateValue.split(" ")[1]
                // @ts-ignore
              } - ${dayjs(dateValue).format("MMM DD, YYYY ")} ${dateValue.split(" ")[1]}`}
        </h1>
        <div className="w-full flex items-center justify-between">
          <DatePicker
            showTime
            showSecond={false}
            defaultValue={dayjs("2022-06-02 00:00", "YYYY-MM-DD HH:mm")}
            value={dayjs(String(dateValue), "YYYY-MM-DD HH:mm")}
            renderExtraFooter={() => (
              <div className="flex items-center justify-end gap-10 pr-2 font-bold">
                <span>H</span> <span>M</span>
              </div>
            )}
            minuteStep={15}
            onChange={(value, dateString) => {
              if (dateString !== undefined) {
                setDateValue(dateString);
              } else {
                setDateValue("2022-06-02 00:00");
              }
            }}
            placeholder="Select date"
            minDate={
              dropDownPeriodValue == "7"
                ? dayjs("2022-06-01", "YYYY-MM-DD").add(7, "day")
                : dayjs("2022-06-02", "YYYY-MM-DD")
            }
            maxDate={dayjs("2022-08-31", "YYYY-MM-DD")}
            className="w-[60%] bg-dark-blue border-[1px] border-border py-1 text-white hover:text-black"
          />
          <AntSelect
            options={selectOptions}
            defaultValue={"daily"}
            onChange={(value) => {
              if (value === "daily") {
                setDropDownPeriodValue("1");
              } else if (value === "weekly") {
                setDropDownPeriodValue("7");
                if (dateValue.includes("2022-06-02")) {
                  setDateValue(`2022-06-08 ${String(dateValue).split("2022-06-02")[1]}`);
                }
              } else {
                setDropDownPeriodValue(value.split(" ")[0]);
              }
            }}
            placeholder="Select period"
            className="w-[35%] bg-dark-blue border-[1px] border-border antSelect"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider className="my-[8px]" />
                <div className="flex items-center justify-center flex-col">
                  <Input
                    placeholder="Please enter days (5)"
                    ref={inputRef}
                    value={numberOfDays}
                    onChange={onNameChange}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <Button onClick={addItem} className="w-full bg-button-blue rounded-sm text-bright-blue py-1 mt-2">
                    Add
                  </Button>
                </div>
              </>
            )}
          />
        </div>
        {apiData !== null && (
          <>
            <div className="flex items-end justify-between my-4">
              <div className="w-[28%] h-full flex flex-col gap-1 text-[12px] md:text-[14px]">
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    setLineGraphTitle("Energy Consumption (W)");
                    setCurrentlySelectedGraphValue(1);
                  }}
                >
                  Energy Consumption(W)
                </h2>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    setLineGraphTitle("PPD Level(%)");
                    setCurrentlySelectedGraphValue(2);
                  }}
                >
                  PPD Level(%)
                </h2>
                <h2
                  className="cursor-pointer"
                  onClick={() => {
                    setLineGraphTitle("CO2(PPM)");
                    setCurrentlySelectedGraphValue(3);
                  }}
                >
                  CO2(ppm)
                </h2>
              </div>
              <div className="md:w-[70%] w-[69%]">
                <div className="flex items-center md:text-[14px] text-[12px] justify-between">
                  <h2 className="md:w-[33%]">Baseline</h2>
                  <h2 className="md:w-[33%]">Optimized</h2>
                  <h2 className="md:w-[33%]">Efficiency Rate</h2>
                </div>
                <div>
                  <ActivePeriodUsageValues
                    baseline={String((apiData?.baseline[0] * 1000).toFixed(2))}
                    rl={String((apiData?.RL[0] * 1000).toFixed(2))}
                    efficient={apiData?.rate[0].toFixed(2)}
                  />
                  <ActivePeriodUsageValues
                    baseline={apiData?.baseline[1].toFixed(2)}
                    rl={apiData?.RL[1].toFixed(2)}
                    efficient={apiData?.rate[1].toFixed(2)}
                  />
                  <ActivePeriodUsageValues
                    baseline={apiData?.baseline[2].toFixed(2)}
                    rl={apiData?.RL[2].toFixed(2)}
                    efficient={apiData?.rate[2].toFixed(2)}
                  />
                </div>
              </div>
            </div>
            {/* <h1 className="text-[16px] text-white mb-0 bg-[#1a2736] px-4 py-0 mt-4 w-[80%] mx-auto text-center">
              {dateValue.includes("2022-06-01")
                ? //@ts-ignore
                  `${dateValue} - ${dayjs(dateValue).add(Number(dropDownPeriodValue), "day").format("YYYY-MM-DD")}`
                : // @ts-ignore
                  `${dayjs(dateValue).subtract(Number(dropDownPeriodValue), "day").format("YYYY-MM-DD")} ${
                    // @ts-ignore
                    dateValue.split(" ")[1]
                  } - ${dateValue}`}
            </h1> */}
          </>
        )}

        <LineChart
          title={lineGraphTitle}
          currentDateTime={dateValue}
          apiData={apiData}
          currentSelectedValue={currentlySelectedGraphValue}
        />

        <h1 className="text-xl text-white mb-2 font-bold mt-6">HVAC Efficiency and Maintenance</h1>
        {data.map((item) => (
          <PowerUsageCards key={item.text} text={item.text} value={item.value} />
        ))}
      </CardContent>
    </Card>
  );
};

const PowerUsageCards = ({ text, value }: { text: string; value: string }) => {
  return (
    <div className="flex items-center justify-between w-full text-[#8e9092] mb-2">
      <p className="w-[86%] bg-[#1a2736] px-4 py-2 text-sm">{text}</p>
      <p className="w-[12%] bg-[#1a2736] px-4 py-2 text-sm flex items-center justify-center">{value}</p>
    </div>
  );
};

const ActivePeriodUsageValues = ({ baseline, rl, efficient }: { baseline: string; rl: string; efficient: string }) => {
  return (
    <div className="flex items-center text-text-gray gap-1 justify-between">
      <h2 className="w-[33%]">{baseline}</h2>
      <h2 className="w-[33%]">{rl}</h2>
      <h2 className="w-[33%]">{efficient}</h2>
    </div>
  );
};

const BottomText = ({
  amount,
  text,
  color,
  units,
  dollarSign,
}: {
  amount: string;
  text: string;
  color: string;
  units?: boolean;
  dollarSign?: boolean;
}) => {
  return (
    <div className="md:w-[20%] w-[45%] md:my-0 my-3 text-center">
      <h1 className={`${color} text-3xl font-bold`}>
        <span className="text-3xl">{dollarSign ? `$` : ""}</span>
        {dollarSign ? (Number(amount) * 0.15).toFixed(2) : amount}
        <span className="text-xl">{units ? `kW` : ""}</span>
      </h1>
      <p>{text}</p>
    </div>
  );
};
