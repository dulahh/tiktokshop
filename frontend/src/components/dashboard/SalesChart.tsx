import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", sales: 186000, profit: 37200 },
  { month: "Feb", sales: 225000, profit: 45000 },
  { month: "Mar", sales: 237000, profit: 47400 },
  { month: "Apr", sales: 173000, profit: 34600 },
  { month: "May", sales: 299000, profit: 59800 },
  { month: "Jun", sales: 334000, profit: 66800 },
  { month: "Jul", sales: 285000, profit: 57000 },
  { month: "Aug", sales: 367000, profit: 73400 },
  { month: "Sep", sales: 298000, profit: 59600 },
  { month: "Oct", sales: 421000, profit: 84200 },
  { month: "Nov", sales: 386000, profit: 77200 },
  { month: "Dec", sales: 456000, profit: 91200 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export const SalesChart = () => {
  return (
    <Card className="bg-gradient-card border-0 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Sales Analytics
        </CardTitle>
        <CardDescription>
          Monthly sales and profit overview for the current year
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-muted-foreground"
              />
              <YAxis hide />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />} 
              />
              <Area
                dataKey="sales"
                type="monotone"
                fill="url(#fillSales)"
                fillOpacity={0.4}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Area
                dataKey="profit"
                type="monotone"
                fill="url(#fillProfit)"
                fillOpacity={0.4}
                stroke="hsl(var(--accent))"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};