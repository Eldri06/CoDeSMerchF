import { DollarSign, TrendingUp, PieChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

interface PaymentDataEntry {
    name: string;
    value: number;
    percentage: number;
  }
const Revenue = () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Revenue Analysis</h1>
        <p className="text-muted-foreground">Track and analyze your revenue streams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="text-primary" size={24} />
            </div>
            <Badge>Intramurals 2025</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">₱45,230</h3>
          <p className="text-sm text-muted-foreground mb-2">Total Sales</p>
          <div className="flex items-center gap-1 text-success text-sm">
            <TrendingUp size={16} />
            <span>+15.2% vs last event</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="text-success" size={24} />
            </div>
            <Badge variant="secondary">40.0%</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">₱18,092</h3>
          <p className="text-sm text-muted-foreground mb-2">Net Profit</p>
          <p className="text-xs text-muted-foreground">Profit Margin</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <PieChart className="text-warning" size={24} />
            </div>
            <Badge variant="outline">Breakdown</Badge>
          </div>
          <h3 className="text-2xl font-bold mb-1">₱27,138</h3>
          <p className="text-sm text-muted-foreground mb-2">Total Costs</p>
          <p className="text-xs text-muted-foreground">60% of revenue</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-6">Payment Methods</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name} ${entry.percentage}%`}
                outerRadius={100}
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
                  borderRadius: "8px"
                }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Revenue;