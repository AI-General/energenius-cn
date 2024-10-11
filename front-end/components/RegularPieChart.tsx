"use client";
import { FC, useState, useEffect } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

//   { name: "Cooling System", Total: 19, fill: "var(--color-cooling)" },

interface Props {
  ChartConfig: ChartConfig;
  chartData: { name: string; Total: number; fill: string }[];
  title: string;
}

const RegularPieChart: FC<Props> = ({ ChartConfig, chartData, title }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);
  return (
    <Card className="bg-dark-blue w-full h-[49%] relative pr-0 pt-5 pl-1">
      <CardContent>
        <h2 className="text-white font-bold md:text-xl text-[16px] mb-0 ml-1">{title}</h2>
        <div className="h-full flex items-center justify-start gap-4 mt-2">
          <ChartContainer config={ChartConfig} className="ml-3 aspect-square max-h-full w-[60%] md:w-[50%]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie innerRadius={isMobile ? 20 : 35} data={chartData} dataKey="Total" nameKey="name">
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 10}
                            className="fill-muted-foreground text-[12px] p-0 m-0"
                          >
                            Total
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 12}
                            className="fill-foreground md:text-[18px] text-[12px] font-bold"
                          >
                            100
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="text-[14px]">
            {chartData.map((item) => (
              <div key={item.name} className="mb-2">
                <p className="text-text-gray flex items-center whitespace-nowrap justify-start gap-1">
                  <span style={{ backgroundColor: item.fill }} className={`h-3 w-3 rounded-full`}></span>
                  {item.name}: {item.Total}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegularPieChart;
