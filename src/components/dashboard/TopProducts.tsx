import { useEffect, useMemo, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
import { useEventContext } from "@/context/EventContext";
import { formatCurrency } from "@/lib/utils";
import { productService, type Product } from "@/services/productService";

interface TopItem {
  pid: string;
  name: string;
  sold: number;
  revenue: number;
  trend: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
}

const TopProducts = () => {
  const { currentEventId } = useEventContext();
  type TxnShape = { id?: string; items?: Array<{ productId: string; name: string; price: number; quantity: number }>; createdAt?: string; eventId?: string | null };
  const [txns, setTxns] = useState<TxnShape[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    (async () => {
      const all = await productService.getAllProducts();
      setProducts(all);
    })();
  }, []);

  const top = useMemo(() => {
    const latestMs = txns.reduce((m, t) => {
      const ms = t.createdAt ? new Date(t.createdAt).getTime() : 0;
      return ms > m ? ms : m;
    }, 0);
    const now = latestMs || Date.parse("2000-01-01T00:00:00Z");
    const winDays = 7;
    const prevStart = now - 14 * 24 * 60 * 60 * 1000;
    const prevEnd = now - 7 * 24 * 60 * 60 * 1000;
    const curStart = now - winDays * 24 * 60 * 60 * 1000;
    const mapSold: Record<string, number> = {};
    const mapRevenue: Record<string, number> = {};
    const mapName: Record<string, string> = {};
    const mapPid: Record<string, string> = {};
    const curSoldWindow: Record<string, number> = {};
    const prevSoldWindow: Record<string, number> = {};
    txns.forEach((t) => {
      const ts = t.createdAt ? new Date(t.createdAt).getTime() : 0;
      const items = Array.isArray(t.items) ? t.items : [];
      items.forEach((it) => {
        const pid = String(it.productId || it.name);
        mapName[pid] = it.name;
        mapPid[pid] = String(it.productId || pid);
        const qty = Number(it.quantity || 0);
        const rev = Number(it.price || 0) * qty;
        mapSold[pid] = (mapSold[pid] || 0) + qty;
        mapRevenue[pid] = (mapRevenue[pid] || 0) + rev;
        if (ts >= curStart) curSoldWindow[pid] = (curSoldWindow[pid] || 0) + qty;
        if (ts >= prevStart && ts < prevEnd) prevSoldWindow[pid] = (prevSoldWindow[pid] || 0) + qty;
      });
    });
    const byId: Record<string, Product> = Object.fromEntries(products.map((p) => [String(p.id || ""), p]));
    const items: TopItem[] = Object.keys(mapSold).map((pid) => {
      const cur = curSoldWindow[pid] || 0;
      const prev = prevSoldWindow[pid] || 0;
      const trend = prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);
      const prod = byId[mapPid[pid]];
      return { pid: mapPid[pid], name: mapName[pid] || pid, sold: mapSold[pid] || 0, revenue: mapRevenue[pid] || 0, trend, imageUrl: prod?.imageUrl, category: prod?.category, stock: prod?.stock };
    });
    items.sort((a, b) => b.sold - a.sold);
    return items.slice(0, 5);
  }, [txns, products]);

  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Top Products</h3>
          <p className="text-sm text-muted-foreground">Best sellers this event</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-primary hover:text-primary"
          onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: { section: "products" } }))}
        >
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {top.map((product, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: { section: "products", productSearch: product.name } }))}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs">{product.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sold} sold • {product.category || ""}{typeof product.stock === 'number' ? ` • ${product.stock} In Stock` : ""}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatCurrency(product.revenue)}</p>
              <div className="flex items-center gap-1 justify-end">
                {product.trend > 0 ? (
                  <TrendingUp size={12} className="text-accent" />
                ) : (
                  <TrendingDown size={12} className="text-destructive" />
                )}
                <span className={`text-xs ${product.trend > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {product.trend > 0 ? '+' : ''}{product.trend}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProducts;
