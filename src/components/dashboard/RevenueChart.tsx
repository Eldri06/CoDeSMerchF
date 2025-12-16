import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
import { useEventContext } from "@/context/EventContext";
import { getGeneralSettings } from "@/lib/utils";

type Period = "1d" | "5d" | "7d" | "30d";

const RevenueChart = () => {
  const { currentEventId } = useEventContext();
  const [period, setPeriod] = useState<Period>("7d");
  type TxnShape = { id?: string; total?: number; createdAt?: string; eventId?: string | null };
  const [txns, setTxns] = useState<TxnShape[]>([]);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, TxnShape>) : {};
      const list = Object.entries(obj).map(([id, t]) => ({ ...t, id }));
      const filtered = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      setTxns(filtered);
    });
    return () => unsub();
  }, [currentEventId]);

  const series = useMemo(() => {
    const now = new Date();
    if (period === "1d") {
      const buckets: number[] = Array.from({ length: 24 }, () => 0);
      txns.forEach((t) => {
        const ts = t.createdAt ? new Date(t.createdAt) : undefined;
        if (!ts) return;
        const sameDay = ts.getFullYear() === now.getFullYear() && ts.getMonth() === now.getMonth() && ts.getDate() === now.getDate();
        if (!sameDay) return;
        const h = ts.getHours();
        buckets[h] = (buckets[h] || 0) + Number(t.total || 0);
      });
      return buckets.map((revenue, h) => ({ date: `${String(h).padStart(2, "0")}:00`, revenue }));
    }
    const days = period === "5d" ? 5 : period === "7d" ? 7 : 30;
    const buckets: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      buckets[key] = 0;
    }
    txns.forEach((t) => {
      const ts = t.createdAt ? new Date(t.createdAt) : undefined;
      if (!ts) return;
      const diffDays = Math.floor((now.getTime() - ts.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays < 0 || diffDays >= days) return;
      const key = `${ts.getFullYear()}-${ts.getMonth() + 1}-${ts.getDate()}`;
      buckets[key] = (buckets[key] || 0) + Number(t.total || 0);
    });
    const fmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit" });
    return Object.entries(buckets).map(([key, revenue]) => {
      const [y, m, d] = key.split("-").map((n) => Number(n));
      const label = fmt.format(new Date(y, m - 1, d));
      return { date: label, revenue };
    });
  }, [txns, period]);

  return (
    <Card className="p-4 md:p-6 glass-card border-border/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-semibold mb-0.5 md:mb-1">Revenue Trend</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Last {period.toUpperCase()}</p>
        </div>
        <div className="flex gap-1.5 md:gap-2">
          <Button variant={period === "1d" ? "default" : "outline"} size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3" onClick={() => setPeriod("1d")}>1D</Button>
          <Button variant={period === "5d" ? "default" : "outline"} size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3" onClick={() => setPeriod("5d")}>5D</Button>
          <Button variant={period === "7d" ? "default" : "outline"} size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3" onClick={() => setPeriod("7d")}>7D</Button>
          <Button variant={period === "30d" ? "default" : "outline"} size="sm" className="text-xs h-7 px-2 md:h-8 md:px-3" onClick={() => setPeriod("30d")}>30D</Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={series}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => {
            const { currency } = getGeneralSettings();
            const symbol = currency === 'USD' ? '$' : '₱';
            return `${symbol}${(value as number) / 1000}k`;
          }} width={40} />
          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => {
            const { currency } = getGeneralSettings();
            const symbol = currency === 'USD' ? '$' : '₱';
            return [`${symbol}${Number(value).toLocaleString()}`, 'Revenue'];
          }} />
          <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default RevenueChart;
