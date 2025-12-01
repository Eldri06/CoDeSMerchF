import { GitCompare, Calendar } from "lucide-react";
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
} from "recharts";

const EventComparison = () => {
  const comparisonData = [
    { event: "Intramurals '25", revenue: 45230, transactions: 156, items: 284 },
    { event: "ICT Week '24", revenue: 42500, transactions: 148, items: 265 },
    { event: "Christmas '24", revenue: 35000, transactions: 124, items: 198 },
    { event: "Foundation '24", revenue: 68000, transactions: 245, items: 412 },
  ];

  const events = [
    {
      name: "Intramurals 2025",
      date: "Feb 15-17, 2025",
      revenue: 45230,
      growth: 6.4,
      transactions: 156,
      avgSale: 290,
      topProduct: "CoDeS T-Shirt (L)",
      status: "Ongoing",
    },
    {
      name: "ICT Week 2024",
      date: "Dec 5-8, 2024",
      revenue: 42500,
      growth: 21.4,
      transactions: 148,
      avgSale: 287,
      topProduct: "CoDeS Lanyard",
      status: "Completed",
    },
    {
      name: "Christmas Bazaar",
      date: "Dec 18-20, 2024",
      revenue: 35000,
      growth: 16.7,
      transactions: 124,
      avgSale: 282,
      topProduct: "CoDeS Stickers",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Event Comparison</h1>
        <p className="text-muted-foreground">Compare performance across different CoDeS events</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <GitCompare className="text-primary" size={24} />
          <h2 className="text-xl font-bold">Revenue Comparison</h2>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="event" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₱)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="transactions" fill="hsl(var(--secondary))" name="Transactions" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Event Details</h2>
        {events.map((event, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>{event.date}</span>
                </div>
              </div>
              <Badge variant={event.status === "Ongoing" ? "default" : "secondary"}>
                {event.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenue</p>
                <p className="text-lg font-bold">₱{event.revenue.toLocaleString()}</p>
                <Badge className="mt-1 bg-success text-xs">+{event.growth}%</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transactions</p>
                <p className="text-lg font-bold">{event.transactions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Sale</p>
                <p className="text-lg font-bold">₱{event.avgSale}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">Top Product</p>
                <p className="font-bold">{event.topProduct}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventComparison;