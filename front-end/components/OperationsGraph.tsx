"use client";
import { useState, FC, useEffect } from "react";
import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis, AreaChart, Area } from "recharts";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import dayjs from "dayjs";

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

const OperationsGraph = ({
  title,
  // chartConfig,/
  lineGraphData,
  dataKey,
  color,
}: {
  title: string;
  lineGraphData: any;
  // chartConfig: ChartConfig;
  dataKey: string;
  color: string;
}) => {
  return (
    <Card className="bg-dark-blue mt-4 w-full md:p-0 pt-5">
      <CardHeader className="p-0 m-0 md:pt-4 pt-1 md:pl-8 pl-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pl-0 pb-0 w-full">
        <ChartContainer className="w-full mt-[20px] h-[260px]" config={chartConfig}>
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
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="day"
              tickLine={true}
              axisLine={true}
              tickMargin={5}
              // interval={7}
              tickFormatter={(day) => day}
              //   tickFormatter={formatXAxis}
              axisType="xAxis"
            />
            <YAxis tickLine={true} axisLine={true} tickMargin={2} />
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
    </Card>
  );
};

export default OperationsGraph;
