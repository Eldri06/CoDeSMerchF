import { useEffect, useMemo, useState } from "react";
import { DollarSign, TrendingUp, PieChart, ChevronDown, ChevronUp, LineChart as LineChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEventContext } from "@/context/EventContext";
import { Transaction } from "@/services/transactionService";
import { Product } from "@/services/productService";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
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
  const { currentEventId, currentEventName } = useEventContext();
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [showPaymentChart, setShowPaymentChart] = useState(false);
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    const r = ref(database, "products");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, Product>) : {};
      const list: Product[] = Object.entries(obj).map(([id, p]) => ({ ...(p as Product), id }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const totalRevenue = useMemo(() => txns.reduce((sum, t) => sum + Number(t.total || 0), 0), [txns]);

  const productCostMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach((p) => {
      if (p.id) map[p.id] = Number(p.cost || 0);
    });
    return map;
  }, [products]);

  const totalCosts = useMemo(() => {
    return txns.reduce((sum, t) => {
      const items = Array.isArray(t.items) ? t.items : [];
      const costForTxn = items.reduce((acc, it) => acc + Number(it.quantity || 0) * Number(productCostMap[it.productId] || 0), 0);
      return sum + costForTxn;
    }, 0);
  }, [txns, productCostMap]);

  const netProfit = useMemo(() => Math.max(0, totalRevenue - totalCosts), [totalRevenue, totalCosts]);
  const profitMarginPct = useMemo(() => {
    if (!totalRevenue) return 0;
    return (netProfit / totalRevenue) * 100;
  }, [netProfit, totalRevenue]);
  type PaymentSlice = { name: string; value: number; percentage: number };
  const paymentData: PaymentSlice[] = useMemo(() => {
    const totals: Record<string, number> = {};
    txns.forEach((t) => {
      const key = (t.paymentMethod || "cash").toLowerCase();
      totals[key] = (totals[key] || 0) + Number(t.total || 0);
    });
    const entries = Object.entries(totals).map(([name, value]) => ({ name: name === "gcash" ? "GCash" : name === "cash" ? "Cash" : name, value }));
    const sum = entries.reduce((s, e) => s + e.value, 0) || 1;
    return entries.map((e) => ({ ...e, percentage: Math.round((e.value / sum) * 100) }));
  }, [txns]);

  const revenueData = useMemo(() => {
    const byDay: Record<string, number> = {};
    txns.forEach((t) => {
      const d = t.createdAt ? new Date(t.createdAt) : new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      byDay[key] = (byDay[key] || 0) + Number(t.total || 0);
    });
    return Object.entries(byDay)
      .sort(([d1], [d2]) => d1.localeCompare(d2))
      .map(([day, revenue]) => ({ day, revenue }));
  }, [txns]);

  const changeVsPrevDay = useMemo(() => {
    if (revenueData.length < 2) return null;
    const prev = Number(revenueData[revenueData.length - 2].revenue || 0);
    const last = Number(revenueData[revenueData.length - 1].revenue || 0);
    if (prev === 0) return null;
    return ((last - prev) / prev) * 100;
  }, [revenueData]);

  const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--muted))"];

  const TrendChart = (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Revenue Trend</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} name="Revenue" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );

  const PaymentChart = (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Payment Methods</h2>
      <ResponsiveContainer width="100%" height={250}>
        <RePieChart>
          <Pie
            data={paymentData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${Math.round(((percent || 0) as number) * 100)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {paymentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
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
            <Badge className="text-xs">{currentEventName}</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱{totalRevenue.toFixed(2)}</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Sales</p>
          {changeVsPrevDay !== null ? (
            <div className="flex items-center gap-1 text-success text-xs md:text-sm">
              <TrendingUp size={14} />
              <span>{`${changeVsPrevDay >= 0 ? "+" : ""}${changeVsPrevDay.toFixed(1)}% vs prev day`}</span>
            </div>
          ) : (
            <div className="text-xs md:text-sm text-muted-foreground">No prior day data</div>
          )}
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="text-success" size={20} />
            </div>
            <Badge variant="secondary" className="text-xs">{`${profitMarginPct.toFixed(1)}%`}</Badge>
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱{netProfit.toFixed(2)}</h3>
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
          <h3 className="text-xl md:text-2xl font-bold mb-1">₱{totalCosts.toFixed(2)}</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-2">Total Costs</p>
          <p className="text-xs text-muted-foreground">{totalRevenue ? `${((totalCosts / totalRevenue) * 100).toFixed(1)}% of revenue` : "—"}</p>
        </Card>
      </div>

      {/* Desktop Charts */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">{TrendChart}{PaymentChart}</div>

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
          <CollapsibleContent className="mt-3 animate-accordion-down">{TrendChart}</CollapsibleContent>
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
          <CollapsibleContent className="mt-3 animate-accordion-down">{PaymentChart}</CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Revenue;
