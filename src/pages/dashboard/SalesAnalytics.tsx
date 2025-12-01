import { BarChart3, TrendingUp, Package, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const SalesAnalytics = () => {
  const productSalesData = [
    { product: "T-Shirt", sales: 45, revenue: 11250 },
    { product: "Lanyard", sales: 120, revenue: 6000 },
    { product: "Keychain", sales: 35, revenue: 1050 },
    { product: "Sticker", sales: 80, revenue: 2000 },
    { product: "Mug", sales: 15, revenue: 2250 },
  ];

  const hourlyData = [
    { hour: "9AM", sales: 12 },
    { hour: "10AM", sales: 25 },
    { hour: "11AM", sales: 35 },
    { hour: "12PM", sales: 45 },
    { hour: "1PM", sales: 40 },
    { hour: "2PM", sales: 38 },
    { hour: "3PM", sales: 30 },
    { hour: "4PM", sales: 22 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Sales Analytics</h1>
        <p className="text-muted-foreground">Detailed sales performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <BarChart3 className="text-primary" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">284</h3>
          <p className="text-sm text-muted-foreground">Total Items Sold</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
            <TrendingUp className="text-success" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">₱35.25</h3>
          <p className="text-sm text-muted-foreground">Avg Transaction</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
            <Package className="text-secondary" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">12</h3>
          <p className="text-sm text-muted-foreground">Products Sold</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
            <Calendar className="text-warning" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">3 Days</h3>
          <p className="text-sm text-muted-foreground">Event Duration</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Sales by Product</h2>
          <Badge>Top Performers</Badge>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={productSalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="product" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="hsl(var(--primary))" name="Units Sold" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Hourly Sales Pattern</h2>
          <Badge variant="secondary">Peak Hours</Badge>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default SalesAnalytics;