import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { productService, type Product as Prod } from "@/services/productService";

const LowStockAlerts = () => {
  const [items, setItems] = useState<Prod[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = await productService.getLowStockProducts();
        setItems(all.slice(0, 6));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Low Stock Alerts</CardTitle>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
            <Package size={14} />
            Items at or below reorder level
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-16 bg-muted/20 rounded-lg animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">All good. No low stock items.</div>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">SKU {p.sku} • {p.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Stock {p.stock}</Badge>
                  <Badge variant="secondary" className="text-xs">Reorder ≤ {p.reorderLevel ?? 10}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;
