import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Package, AlertTriangle } from "lucide-react";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

type FeedItem = {
  type: "sale" | "restock" | "alert";
  text: string;
  amount?: string;
  ts: number;
};

const ActivityFeed = () => {
  const [txns, setTxns] = useState<Array<{ id?: string; total?: number; createdAt?: string }>>([]);
  const [products, setProducts] = useState<Record<string, { name?: string; stock?: number; reorderLevel?: number }>>({});
  const [movements, setMovements] = useState<Array<{ productId: string; type: string; qty: number; timestamp?: string }>>([]);

  useEffect(() => {
    const rt = ref(database, "transactions");
    const rp = ref(database, "products");
    const rm = ref(database, "stockMovements");
    const unsubT = onValue(rt, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const list = Object.entries(obj).map(([id, t]) => ({ ...(t as any), id }));
      setTxns(list);
    });
    const unsubP = onValue(rp, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const map: Record<string, any> = {};
      Object.entries(obj).forEach(([id, p]) => (map[id] = p));
      setProducts(map);
    });
    const unsubM = onValue(rm, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const list: Array<{ productId: string; type: string; qty: number; timestamp?: string }> = [];
      Object.entries(obj).forEach(([pid, moves]) => {
        const mv = moves as Record<string, any>;
        Object.values(mv).forEach((entry) => {
          list.push({ productId: pid, type: String(entry.type || ""), qty: Number(entry.qty || 0), timestamp: entry.timestamp });
        });
      });
      setMovements(list);
    });
    return () => {
      unsubT();
      unsubP();
      unsubM();
    };
  }, []);

  const items = useMemo(() => {
    const list: FeedItem[] = [];
    txns.forEach((t) => {
      const ts = t.createdAt ? new Date(t.createdAt).getTime() : Date.now();
      list.push({ type: "sale", text: `Sale completed`, amount: `₱${Number(t.total || 0).toLocaleString()}` , ts });
    });
    movements.forEach((m) => {
      const name = products[m.productId]?.name || m.productId;
      const ts = m.timestamp ? new Date(m.timestamp).getTime() : Date.now();
      if (m.type === "sale") list.push({ type: "sale", text: `${name} sold x${m.qty}`, ts });
      else list.push({ type: "restock", text: `${name} restocked x${m.qty}`, ts });
    });
    Object.entries(products).forEach(([pid, p]) => {
      const stock = Number(p.stock || 0);
      const threshold = Number(p.reorderLevel ?? 10);
      if (stock <= threshold) list.push({ type: "alert", text: `${p.name || pid} low stock (${stock})`, ts: Date.now() });
    });
    list.sort((a, b) => b.ts - a.ts);
    return list.slice(0, 8);
  }, [txns, movements, products]);

  const formatAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and alerts</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((activity, index) => {
          const Icon = activity.type === "sale" ? CheckCircle : activity.type === "restock" ? Package : AlertTriangle;
          const color = activity.type === "sale" ? "text-accent" : activity.type === "restock" ? "text-primary" : "text-amber-500";
          const bgColor = activity.type === "sale" ? "bg-accent/10" : activity.type === "restock" ? "bg-primary/10" : "bg-amber-500/10";
          return (
            <div
              key={index}
              className="flex gap-4 cursor-pointer"
              onClick={() => {
                const section = activity.type === "sale" ? "transactions" : activity.type === "restock" ? "stock" : "products";
                window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: { section } }));
              }}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${bgColor} flex-shrink-0`}>
                <Icon size={20} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.text}</p>
                {activity.amount && <p className="text-sm text-accent font-semibold">{activity.amount}</p>}
                <p className="text-xs text-muted-foreground mt-1">{formatAgo(activity.ts)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">View All Activity</button>
    </Card>
  );
};

export default ActivityFeed;
