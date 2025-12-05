import { useState } from "react";
import { DollarSign, TrendingUp, PieChart, ChevronDown, ChevronUp, LineChart as LineChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Revenue = () => {
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [showPaymentChart, setShowPaymentChart] = useState(false);

  const revenueData = [
    { day: "Day 1", revenue: 12000, profit: 4800 },
    { day: "Day 2", revenue: 15000, profit: 6000 },
    { day: "Day 3", revenue: 18230, profit: 7292 },
  ];

  const paymentData = [
    { name: "Cash", value: 29400, percentage: 65 },
    { name: "GCash", value: 13569, percentage: 30 },
    { name: "Other", value: 2261, percentage: 5 },
  ];

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted))"];

  const TrendChartContent = () => (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue" />
          <Line type="monotone" dataKey="profit" stroke="hsl(var(--success))" strokeWidth={2} name="Profit" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );

  const PaymentChartContent = () => (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Payment Methods</h2>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie
            data={paymentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.name} ${entry.percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px"
            }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </Card>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Revenue Analysis</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track and analyze your revenue streams</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="text-primary" size={20} />
            </div>
            <Badge className="text-xs">Intramurals 2025</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱45,230</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Sales</p>
          <div className="flex items-center gap-1 text-success text-xs md:text-sm">
            <TrendingUp size={14} />
            <span>+15.2% vs last event</span>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="text-success" size={20} />
            </div>
            <Badge variant="secondary" className="text-xs">40.0%</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱18,092</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Net Profit</p>
          <p className="text-xs text-muted-foreground">Profit Margin</p>
        </Card>

        <Card className="p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <PieChart className="text-warning" size={20} />
            </div>
            <Badge variant="outline" className="text-xs">Breakdown</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱27,138</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Costs</p>
          <p className="text-xs text-muted-foreground">60% of revenue</p>
        </Card>
      </div>

      {/* Desktop Charts */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChartContent />
        <PaymentChartContent />
      </div>

      {/* Mobile Chart Toggles */}
      <div className="md:hidden space-y-3">
        <Collapsible open={showTrendChart} onOpenChange={setShowTrendChart}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between gap-2 h-12 glass-card border-border/50">
              <div className="flex items-center gap-2">
                <LineChartIcon size={18} className="text-primary" />
                <span className="font-medium">Revenue Trend</span>
              </div>
              {showTrendChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 animate-accordion-down">
            <TrendChartContent />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showPaymentChart} onOpenChange={setShowPaymentChart}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between gap-2 h-12 glass-card border-border/50">
              <div className="flex items-center gap-2">
                <PieChart size={18} className="text-secondary" />
                <span className="font-medium">Payment Methods</span>
              </div>
              {showPaymentChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 animate-accordion-down">
            <PaymentChartContent />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Revenue;