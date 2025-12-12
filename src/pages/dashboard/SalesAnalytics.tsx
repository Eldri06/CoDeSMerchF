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
import { useEffect, useMemo, useState } from "react";
import { useEventContext } from "@/context/EventContext";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
import { Transaction, TransactionItem } from "@/services/transactionService";

const SalesAnalytics = () => {
  const { currentEventId } = useEventContext();
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, Transaction>) : {};
      const list: Transaction[] = Object.entries(obj).map(([id, t]) => ({ ...t, id }));
      const filtered = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      setTxns(filtered);
    });
    return () => unsub();
  }, [currentEventId]);

  const totals = useMemo(() => {
    const totalTransactions = txns.length;
    const totalAmount = txns.reduce((sum, t) => sum + Number(t.total || 0), 0);
    const avgTransaction = totalTransactions ? totalAmount / totalTransactions : 0;
    let itemsSold = 0;
    const productIds = new Set<string>();
    txns.forEach((t) => {
      const items: TransactionItem[] = Array.isArray(t.items) ? t.items : [];
      items.forEach((it) => {
        itemsSold += Number(it.quantity || 0);
        productIds.add(String(it.productId || ""));
      });
    });
    const productsSold = productIds.size;
    const times = txns.map((t) => (t.createdAt ? new Date(t.createdAt).getTime() : Date.now()));
    const durationDays = times.length ? Math.max(1, Math.ceil((Math.max(...times) - Math.min(...times)) / (24 * 60 * 60 * 1000)) + 0) : 0;
    return { itemsSold, avgTransaction, productsSold, durationDays };
  }, [txns]);

  const productSalesData = useMemo(() => {
    const map: Record<string, { product: string; sales: number; revenue: number }> = {};
    txns.forEach((t) => {
      const items: TransactionItem[] = Array.isArray(t.items) ? t.items : [];
      items.forEach((it) => {
        const id = String(it.productId || "");
        const name = String(it.name || id);
        const qty = Number(it.quantity || 0);
        const amt = Number(it.price || 0) * qty;
        if (!map[id]) map[id] = { product: name, sales: 0, revenue: 0 };
        map[id].sales += qty;
        map[id].revenue += amt;
      });
    });
    const arr = Object.values(map).sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, 10);
  }, [txns]);

  const hourlyData = useMemo(() => {
    const byHour: Record<string, number> = {};
    txns.forEach((t) => {
      const d = t.createdAt ? new Date(t.createdAt) : new Date();
      const h = d.getHours();
      const label = `${((h + 11) % 12) + 1}${h < 12 ? "AM" : "PM"}`;
      const items: TransactionItem[] = Array.isArray(t.items) ? t.items : [];
      const units = items.reduce((sum, it) => sum + Number(it.quantity || 0), 0);
      byHour[label] = (byHour[label] || 0) + units;
    });
    const labelsOrder = ["12AM","1AM","2AM","3AM","4AM","5AM","6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM","8PM","9PM","10PM","11PM"];
    return labelsOrder.map((l) => ({ hour: l, sales: byHour[l] || 0 })).filter((d) => d.sales > 0);
  }, [txns]);

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
          <h3 className="text-2xl font-bold mb-1">{totals.itemsSold}</h3>
          <p className="text-sm text-muted-foreground">Total Items Sold</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
            <TrendingUp className="text-success" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">₱{totals.avgTransaction.toFixed(2)}</h3>
          <p className="text-sm text-muted-foreground">Avg Transaction</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
            <Package className="text-secondary" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">{totals.productsSold}</h3>
          <p className="text-sm text-muted-foreground">Products Sold</p>
        </Card>

        <Card className="p-6">
          <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
            <Calendar className="text-warning" size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-1">{totals.durationDays} Days</h3>
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
