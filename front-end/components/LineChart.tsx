"use client";
import { useState, FC, useEffect } from "react";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, AreaChart, Area } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import dayjs from "dayjs";

interface Props {
  title: string;
  currentDateTime: string | string[];
  apiData: any;
  currentSelectedValue: number;
}

const LineChart: FC<Props> = ({ title, currentDateTime, apiData, currentSelectedValue }) => {
  const [lineGraphData, setLineGraphData] = useState<any[]>([]);
  const [startHour, setStartHour] = useState(Number(String(currentDateTime)?.split(" ")[1]?.split(":")[0]));
  const [startMinutes, setStartMinutes] = useState(Number(String(currentDateTime)?.split(" ")[1]?.split(":")[1]));

  useEffect(() => {
    // setStartHour(Number(String(currentDateTime).split(" ")[1].split(":")[0]));
    // const generate12HourClockNumbers = (startHour: any) => {
    //   const hoursArr = [];
    //   for (let i = 0; i < 12; i++) {
    //     hoursreturn (startHour + i * 2) % 24);
    //   }
    //   return hoursArr;
    // };

    // const updatedHours = generate12HourClockNumbers(startHour);
    // setHours(updatedHours);
    // const updatedChartData = lineGraphData.map((item, index) => ({
    //   ...item,
    //   values:
    //     String(updatedHours[index % 12]).length === 1
    //       ? `0${updatedHours[index % 12]}`
    //       : String(updatedHours[index % 12]),
    // }));

    // setLineGraphData(updatedChartData);
    if (apiData) {
      const newArr = apiData.df_graph.map((item: any) => {
        if (currentSelectedValue === 1) {
          return {
            values: dayjs(item.datetime).format("HH:mm"),
            baseline: Number(Number(item.true_EnergyCons * 1000).toFixed(2)),
            rl: Number(Number(item.EnergyCons * 1000).toFixed(2)),
          };
        } else if (currentSelectedValue === 2) {
          return {
            values: dayjs(item.datetime).format("HH:mm"),
            baseline: Number(Number(item.true_PPD).toFixed(2)),
            rl: Number(Number(item.ppd).toFixed(2)),
          };
        } else if (currentSelectedValue === 3) {
          return {
            values: dayjs(item.datetime).format("HH:mm"),
            baseline: Number(Number(item.true_ZoneC).toFixed(2)),
            rl: Number(Number(item.zone_c).toFixed(2)),
          };
        }
      });
      setLineGraphData(newArr);
    }
  }, [currentDateTime, startHour, apiData, currentSelectedValue]);

  const chartConfig = {
    baseline: {
      label: "BaseLine",
      color: "#ff4d4d",
    },
    rl: {
      label: "Optimized",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // useEffect(() => {
  //   setStartHour(Number(String(currentDateTime).split(" ")[1].split(":")[0]));
  //   setStartMinutes(Number(String(currentDateTime).split(" ")[1].split(":")[1]));
  //   const data = [];
  //   for (let i = 0; i < 24 * 4; i++) {
  //     // 24 hours * 4 (15-minute intervals in an hour)
  //     const totalMinutes = startHour * 60 + startMinutes + i * 15;
  //     const hour = Math.floor(totalMinutes / 60) % 24;
  //     const minute = totalMinutes % 60;
  //     const timeLabel = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  //     data.push({
  //       values: timeLabel,
  //       baseline: Math.random() * 300, // Random baseline value
  //       rl: Math.random() * 300, // Random rl value
  //     });
  //   }
  //   setLineGraphData(data);
  // }, [startHour, startMinutes, currentDateTime]);

  const formatXAxis = (time: any) => {
    // const date = dayjs(time);
    // const hours = date.hour();
    // const date = dayjs(time);
    const hours = time.split(":")[0];
    if (Number(hours) % 2 === 0) {
      return hours;
    }
    return "";
  };

  return (
    <Card className="bg-transparent mt-4">
      <CardHeader>
        <CardTitle className="md:text-[18px] text-[14px]">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 m-0 md:pr-[10px]">
        <ChartContainer className="w-full mt-[8px]" config={chartConfig}>
          <AreaChart
            className="w-full !overflow-visible"
            accessibilityLayer
            data={lineGraphData}
            margin={{
              left: 0,
              right: 8,
              top: 12,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="values"
              tickLine={false}
              axisLine={true}
              tickMargin={5}
              // interval={7}
              // tickFormatter={(value) => value.split(":")[0]}
              tickFormatter={formatXAxis}
              axisType="xAxis"
            />
            <YAxis
              // dataKey="baseline"
              tickLine={true}
              axisLine={true}
              tickMargin={2}
              tickFormatter={(value) => `${value}`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="baseline"
              type="linear"
              fill="var(--color-baseline)"
              fillOpacity={0.4}
              stroke="var(--color-baseline)"
            />
            <Area
              dataKey="rl"
              type="linear"
              fill="var(--color-rl)"
              className="z-10"
              fillOpacity={0.4}
              stroke="var(--color-rl)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              ...
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {String(dayjs(`${currentDateTime}`).subtract(1, "day").format("YYYY-MM-DD"))}{" "}
              {String(currentDateTime).split(" ")[1]} - {String(currentDateTime)}
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};

export default LineChart;
