import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle } from "lucide-react";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

const LowStockAlerts = () => {
  const [products, setProducts] = useState<Array<{ id?: string; name?: string; stock?: number; reorderLevel?: number }>>([]);

  useEffect(() => {
    const r = ref(database, "products");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const list = Object.entries(obj).map(([id, p]) => ({ ...(p as any), id }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const lowStockItems = useMemo(() => {
    return products
      .filter((p) => Number(p.stock || 0) <= Number(p.reorderLevel ?? 10))
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
      .slice(0, 6)
      .map((p) => ({ name: p.name || String(p.id || ""), stock: Number(p.stock || 0), reorder: Number(p.reorderLevel ?? 10) }));
  }, [products]);

  if (lowStockItems.length === 0) {
    return (
      <Card className="p-8 glass-card border-border/50 text-center">
        <Package size={48} className="mx-auto text-accent mb-4" />
        <h3 className="text-lg font-semibold mb-2">All items are well stocked!</h3>
        <p className="text-sm text-muted-foreground">No low stock alerts at this time.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
          <AlertTriangle size={20} className="text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Low Stock Alerts</h3>
          <p className="text-sm text-muted-foreground">{lowStockItems.length} items need restocking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lowStockItems.map((item, index) => (
          <div key={index} className="p-4 rounded-xl border-l-4 border-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-xs">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm mb-1 truncate">{item.name}</p>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-amber-500 font-semibold">{item.stock} units</span> left
                  </p>
                  <p className="text-xs text-muted-foreground">Reorder at: {item.reorder}</p>
                </div>
                <Button size="sm" variant="outline" className="mt-3 w-full text-xs border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/10">Restock Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default LowStockAlerts;
