import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

const data = [
  { date: "Jan 15", revenue: 12500 },
  { date: "Jan 16", revenue: 15200 },
  { date: "Jan 17", revenue: 18100 },
  { date: "Jan 18", revenue: 16800 },
  { date: "Jan 19", revenue: 21500 },
  { date: "Jan 20", revenue: 24200 },
  { date: "Jan 21", revenue: 22800 },
  { date: "Jan 22", revenue: 28500 },
  { date: "Jan 23", revenue: 31200 },
  { date: "Jan 24", revenue: 27800 },
];

const RevenueChart = () => {
  return (
    <Card className="p-4 md:p-6 glass-card border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-0.5 md:mb-1">Revenue Trend</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Last 30 days performance</p>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <Button variant="outline" size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3">7D</Button>
          <Button variant="default" size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3">30D</Button>
          <Button variant="outline" size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3">3M</Button>
          <Button variant="outline" size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3">1Y</Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₱${value / 1000}k`}
            width={40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;