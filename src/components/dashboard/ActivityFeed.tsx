import { Card } from "@/components/ui/card";
import { CheckCircle, Package, AlertTriangle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import { useEventContext } from "@/context/EventContext";

type Movement = { type: string; qty: number; eventId?: string | null; note?: string; timestamp?: string };
type Txn = { id?: string; eventId?: string | null; createdAt?: string; items?: Array<{ productId: string; name: string; quantity: number }> };

const ActivityFeed = () => {
  const { currentEventId } = useEventContext();
  const [stockItems, setStockItems] = useState<Array<{ productId: string; movement: Movement }>>([]);
  const [txnItems, setTxnItems] = useState<Array<{ productId: string; movement: Movement }>>([]);

  useEffect(() => {
    const r = ref(database, "stockMovements");
    const unsub = onValue(r, (snap) => {
      if (!snap.exists()) { setStockItems([]); return; }
      const obj = snap.val() as Record<string, Record<string, Movement>>;
      const flat: Array<{ productId: string; movement: Movement }> = [];
      Object.entries(obj).forEach(([pid, movements]) => {
        Object.values(movements || {}).forEach((mv) => flat.push({ productId: pid, movement: mv }));
      });
      setStockItems(flat);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      if (!snap.exists()) { setTxnItems([]); return; }
      const obj = snap.val() as Record<string, Txn>;
      const list: Array<{ productId: string; movement: Movement }> = [];
      Object.values(obj).forEach((t) => {
        const items = Array.isArray(t.items) ? t.items : [];
        items.forEach((it) => {
          list.push({ productId: String(it.productId || it.name), movement: { type: "sale", qty: Number(it.quantity || 0), eventId: t.eventId ?? null, note: "POS checkout", timestamp: t.createdAt } });
        });
      });
      setTxnItems(list);
    });
    return () => unsub();
  }, []);

  const merged = useMemo(() => {
    const all = [...stockItems, ...txnItems];
    const filtered = currentEventId ? all.filter((x) => ((x.movement.eventId ?? null) === currentEventId) || (x.movement.eventId == null)) : all;
    filtered.sort((a, b) => String(b.movement.timestamp || "").localeCompare(String(a.movement.timestamp || "")));
    return filtered.slice(0, 12);
  }, [stockItems, txnItems, currentEventId]);

  const rows = useMemo(() => merged.map((it) => {
    const isSale = it.movement.type === "sale";
    const isAlert = it.movement.type === "alert";
    const Icon = isSale ? CheckCircle : isAlert ? AlertTriangle : Package;
    return { Icon, it };
  }), [merged]);

  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Synced with POS and inventory</p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-auto pr-1">
        {rows.map(({ Icon, it }, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted/40 flex-shrink-0">
              <Icon size={18} className={it.movement.type === "alert" ? "text-amber-500" : it.movement.type === "sale" ? "text-accent" : "text-primary"} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {it.movement.type === "sale" ? "Sale" : it.movement.type === "alert" ? "Alert" : "Stock"} • {it.productId}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty {it.movement.qty}{it.movement.note ? ` • ${it.movement.note}` : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{formatDateTime(it.movement.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;
