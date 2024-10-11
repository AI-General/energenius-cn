import { BsLightningChargeFill } from "react-icons/bs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import DonutPieChart from "@/components/DonutPieChart";
import RegularPieChart from "@/components/RegularPieChart";
import { ChartConfig } from "@/components/ui/chart";

const Page = () => {
  const chartConfig = {
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
    { name: "Racks", Total: 30, fill: "#172554" },
    { name: "Storage", Total: 25, fill: "#1e40af" },
    { name: "Network Devices", Total: 26, fill: "#2563eb" },
    { name: "Cooling System", Total: 19, fill: "#2dabff" },
  ];

  const pieChartConfig = {
    Total: {
      label: "Total",
    },
    IT: {
      label: "IT Equipment",
      color: "#2dabff",
    },
    Non_IT: {
      label: "Non IT Equipment",
      color: "#102E41",
    },
  } satisfies ChartConfig;

  const pieChartData = [
    { type: "IT Equipment", Total: 115, fill: "var(--color-IT)" },
    { type: "Non IT Equipment", Total: 100, fill: "var(--color-Non_IT)" },
  ];

  return (
    <div className="mt-[6.5%]">
      <div className="w-full flex items-center justify-center flex-col">
        <h1 className="text-5xl font-bold text-white mb-1">Data Center 1</h1>
        <p className="text-text-gray flex items-center gap-4">
          <span>No. of Servers</span>
          <span>PUE: 5300KW</span>
        </p>
        <div className="flex items-center text-[1rem] gap-1 bg-button-blue py-3 px-3 mt-[8px] rounded-[3px] mr-[20px] text-bright-blue">
          <BsLightningChargeFill /> <p>Total Energy Consumption: 5300KW</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 w-[85vw] h-[55vh] mx-auto">
        <div className="w-[49.5%] h-full flex items-center justify-between flex-col">
          <DonutPieChart ChartConfig={pieChartConfig} chartData={pieChartData} title="Power Usage" />
          <RegularPieChart ChartConfig={chartConfig} title="Non IT Equipment" chartData={regularChartData} />
        </div>
        <PowerUsageEffectiveness />
      </div>

      <div className="flex items-center justify-between w-[75vw] mx-auto my-5">
        <BottomText amount="5000KW" text="Bugdeted Power Usage" color="text-white" />
        <BottomText amount="4600KW" text="Acutal Power Usage" color="text-green-600" />
        <Separator orientation="vertical" className="w-[5px] bg-slate-600 rounded-sm h-[60px]" />
        <BottomText amount="$3,600" text="Bugdeted power cost" color="text-white" />
        <BottomText amount="$4,160" text="Actual power cost" color="text-red-600" />
      </div>
    </div>
  );
};

export default Page;

const PowerUsageEffectiveness = () => {
  const data: {
    text: string;
    value: string;
  }[] = [
    {
      text: "Under utilized servers",
      value: "10",
    },
    {
      text: "Standard power",
      value: "800W",
    },
    {
      text: "Ghost servers",
      value: "14",
    },
    {
      text: "Under utilized servers",
      value: "16",
    },
    {
      text: "Under utilized servers",
      value: "25",
    },
  ];
  return (
    <Card className="bg-dark-blue w-[49.5%] h-full pt-8 pl-4">
      <CardContent>
        <h1 className="text-x text-white mb-4">Power Usage Effectiveness</h1>
        {data.map((item) => (
          <PowerUsageCards key={item.text} text={item.text} value={item.value} />
        ))}
      </CardContent>
    </Card>
  );
};

const PowerUsageCards = ({ text, value }: { text: string; value: string }) => {
  return (
    <div className="flex items-center justify-between w-full mb-2">
      <p className="w-[86%] bg-[#1a2736] px-4 py-3 text-sm">{text}</p>
      <p className="w-[12%] bg-[#1a2736] px-4 py-3 text-sm">{value}</p>
    </div>
  );
};

const BottomText = ({ amount, text, color }: { amount: string; text: string; color: string }) => {
  return (
    <div className="w-[20%]">
      <h1 className={`${color} text-3xl font-bold`}>{amount}</h1>
      <p>{text}</p>
    </div>
  );
};
