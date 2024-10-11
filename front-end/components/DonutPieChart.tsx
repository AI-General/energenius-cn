"use client";
import { useMemo, FC } from "react";
import { Label, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  ChartConfig: ChartConfig;
  chartData: { type: string; Total: number; fill: string }[];
  title: string;
}

const DonutPieChart: FC<Props> = ({ ChartConfig, chartData, title }) => {
  const totalEquipment = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.Total, 0);
  }, []);
  return (
    <Card className="bg-dark-blue w-full h-[49%] relative pr-14 pt-5 pl-1">
      <CardContent>
        <h2 className="text-white font-bold md:text-xl text-[16px] mb-0 ml-1">{title}</h2>
        <div className="h-full flex items-center justify-start gap-4">
          <ChartContainer config={ChartConfig} className="mx-4 mt-1 aspect-square max-h-full w-[60%] md:w-[50%]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie data={chartData} dataKey="Total" nameKey="type" innerRadius={35}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 10} className="fill-muted-foreground">
                            Total
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 12}
                            className="fill-foreground text-xl font-bold"
                          >
                            {totalEquipment.toLocaleString()}
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
            <div className="mb-4">
              <h2 className="text-white">{chartData[0].type}</h2>
              <p className="text-text-gray flex items-center gap-1">
                <span className="bg-[#2dabff] h-3 w-3 rounded-full"></span> {chartData[0].Total}%
              </p>
            </div>
            <div>
              <h2 className="text-white">{chartData[1].type}</h2>
              <p className="text-text-gray flex items-center gap-1">
                <span className="bg-[#102E41] h-3 w-3 rounded-full"></span> {chartData[1].Total}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutPieChart;
