import { useEffect, useMemo, useState } from "react";
import { Package, TrendingUp, TrendingDown, AlertTriangle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEventContext } from "@/context/EventContext";
import { productService, Product } from "@/services/productService";
import { Transaction, TransactionItem } from "@/services/transactionService";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

const StockManagement = () => {
  const { currentEventId, currentEventName } = useEventContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [restockQty, setRestockQty] = useState<string>("0");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movements, setMovements] = useState<Array<{ productId: string; qty: number; type: string; eventId?: string | null; note?: string; timestamp: string }>>([]);
  const [txnMovements, setTxnMovements] = useState<Array<{ productId: string; qty: number; type: "sale"; eventId?: string | null; note?: string; timestamp: string }>>([]);
  const [isMovementsOpen, setIsMovementsOpen] = useState(false);
  const [movementSearch, setMovementSearch] = useState("");
  const [restockMode, setRestockMode] = useState<"add" | "set">("add");
  const [isEventView, setIsEventView] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [nameCache, setNameCache] = useState<Record<string, string>>({});

  const reloadProducts = async () => {
    const list = await productService.getAllProducts();
    setProducts(list);
  };

  useEffect(() => {
    (async () => {
      await reloadProducts();
    })();
  }, []);

  useEffect(() => {
    const r = ref(database, "stockMovements");
    const unsub = onValue(r, (snap) => {
      if (!snap.exists()) {
        setMovements([]);
        return;
      }
      type MovementRecord = { qty: number; type: string; eventId?: string | null; note?: string; timestamp?: string };
      const obj = snap.val() as Record<string, Record<string, MovementRecord>>;
      const flat: Array<{ productId: string; qty: number; type: string; eventId?: string | null; note?: string; timestamp: string }> = [];
      Object.entries(obj).forEach(([pid, entries]) => {
        Object.values(entries || {}).forEach((m) => {
          const rec = m as MovementRecord;
          flat.push({ productId: pid, qty: Number(rec.qty || 0), type: String(rec.type || ""), eventId: rec.eventId ?? null, note: rec.note, timestamp: rec.timestamp || new Date().toISOString() });
        });
      });
      setMovements(flat);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      if (!snap.exists()) {
        setTxnMovements([]);
        return;
      }
      const obj = snap.val() as Record<string, Transaction>;
      const list: Transaction[] = Object.entries(obj).map(([id, t]) => ({ ...t, id }));
      const filtered = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      const derived: Array<{ productId: string; qty: number; type: "sale"; eventId?: string | null; note?: string; timestamp: string }> = [];
      filtered.forEach((t) => {
        const items: TransactionItem[] = Array.isArray(t.items) ? (t.items as TransactionItem[]) : [];
        items.forEach((it) => {
          derived.push({ productId: it.productId, qty: Number(it.quantity || 0), type: "sale", eventId: t.eventId ?? null, note: "POS checkout", timestamp: String(t.createdAt || new Date().toISOString()) });
        });
      });
      setTxnMovements(derived);
    });
    return () => unsub();
  }, [currentEventId]);

  const productMap = useMemo(() => {
    const map: Record<string, Product> = {};
    products.forEach((p) => { if (p.id) map[p.id] = p; });
    return map;
  }, [products]);

  const displayed = useMemo(() => {
    let list = [...products];
    if (isEventView && currentEventId) {
      const candidates = [currentEventId, currentEventName];
      const idOrNameMatches = (p: Product) => {
        if ((p.eventId ?? null) && candidates.includes(p.eventId as string)) return true;
        const keys = Object.keys(p.stockByEvent || {});
        return keys.some((k) => candidates.includes(k));
      };
      list = products.filter(idOrNameMatches);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q));
    }
    if (isEventView && currentEventId) {
      return list.map((p) => {
        const candidates = [currentEventId, currentEventName];
        const hasKey = (key: string) => Boolean(p.stockByEvent && key in p.stockByEvent);
        const matchKey = candidates.find((c) => hasKey(c));
        if (matchKey) {
          return { ...p, stock: Number(p.stockByEvent?.[matchKey] ?? 0) } as Product;
        }
        if ((p.eventId ?? null) && candidates.includes(p.eventId as string)) {
          return { ...p, stock: Number(p.stock ?? 0) } as Product;
        }
        return { ...p, stock: 0 } as Product;
      });
    }
    return list;
  }, [products, searchQuery, isEventView, currentEventId, currentEventName]);

  const metrics = useMemo(() => {
    const source = isEventView ? displayed : products;
    const totalProducts = source.length;
    const lowStockCount = source.filter((p) => Number(p.stock ?? 0) < Number(p.reorderLevel ?? 10)).length;
    const inventoryValue = source.reduce((sum, p) => sum + Number(p.stock ?? 0) * Number(p.price || 0), 0);
    return { totalProducts, lowStockCount, inventoryValue };
  }, [products, displayed, isEventView]);

  const alerts = useMemo(() => {
    return displayed
      .filter((p) => Number(p.stock ?? 0) < Number(p.reorderLevel ?? 10))
      .sort((a, b) => Number(a.stock ?? 0) - Number(b.stock ?? 0));
  }, [displayed]);

  const allMovements = useMemo(() => {
    const ledger = (currentEventId ? movements.filter((m) => (m.eventId ?? null) === currentEventId) : movements).map((m) => {
      const tRaw = String(m.type || "").toLowerCase().trim();
      return {
        productId: m.productId,
        product: productMap[m.productId]?.name || m.productId,
        type: tRaw === "restock" ? "in" : "out",
        rawType: tRaw,
        quantity: m.qty,
        reason: m.note || (tRaw === "restock" ? "Restock" : "Sale"),
        time: new Date(m.timestamp).toLocaleString(),
        timestamp: new Date(m.timestamp).getTime(),
      };
    });
    const derived = txnMovements.map((m) => ({
      productId: m.productId,
      product: productMap[m.productId]?.name || m.productId,
      type: "out",
      rawType: "sale",
      quantity: m.qty,
      reason: m.note || "Sale",
      time: new Date(m.timestamp).toLocaleString(),
      timestamp: new Date(m.timestamp).getTime(),
    }));
    const key = (x: { productId: string; rawType: string; quantity: number; timestamp: number }) => `${x.productId}-${x.rawType}-${x.quantity}-${x.timestamp}`;
    const map = new Map<string, typeof ledger[number]>();
    [...ledger, ...derived].forEach((m) => {
      const k = key(m);
      if (!map.has(k)) map.set(k, m);
    });
    return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, [movements, txnMovements, productMap, currentEventId]);

  const recentMovements = useMemo(() => allMovements.slice(0, 8), [allMovements]);

  const filteredMovements = useMemo(() => {
    const tf = String(typeFilter || "").toLowerCase().trim();
    const tfNorm = tf === "sales" ? "sale" : tf;
    return allMovements.filter((m) => {
      const q = movementSearch.toLowerCase();
      const matchSearch = !q || (productMap[m.productId]?.name || nameCache[m.productId] || m.product).toLowerCase().includes(q) || m.reason.toLowerCase().includes(q);
      const matchType = tfNorm === "all" || m.rawType === tfNorm;
      const matchProd = productFilter === "all" || m.productId === productFilter;
      return matchSearch && matchType && matchProd;
    });
  }, [allMovements, movementSearch, typeFilter, productFilter, productMap, nameCache]);

  

  useEffect(() => {
    const missingIds = Array.from(new Set(allMovements
      .filter((m) => !productMap[m.productId] && !nameCache[m.productId])
      .map((m) => m.productId)));
    if (missingIds.length === 0) return;
    (async () => {
      const entries: Array<{ id: string; name: string }> = [];
      for (const id of missingIds) {
        const prod = await productService.getProductById(id);
        if (prod && prod.name) entries.push({ id, name: prod.name });
      }
      if (entries.length > 0) {
        setNameCache((prev) => ({ ...prev, ...Object.fromEntries(entries.map((e) => [e.id, e.name])) }));
      }
    })();
  }, [allMovements, productMap, nameCache]);

  const openRestock = (p: Product) => {
    setSelectedProduct(p);
    setRestockQty("0");
    setRestockMode("add");
    setIsRestockOpen(true);
  };

  const submitRestock = async () => {
    if (!selectedProduct) return;
    const base = Number(selectedProduct.stock ?? 0);
    const qty = Math.max(0, Math.floor(Number(restockQty || 0)));
    if (qty <= 0) { setIsRestockOpen(false); return; }
    if (restockMode === "add") {
      const next = base + qty;
      await productService.updateStock(selectedProduct.id!, next);
      await productService.recordStockMovement(selectedProduct.id!, { type: "restock", qty, eventId: currentEventId ?? null, note: "Manual restock" });
      setMovements((prev) => [...prev, { productId: selectedProduct.id!, qty, type: "restock", eventId: currentEventId ?? null, note: "Manual restock", timestamp: new Date().toISOString() }]);
    } else {
      if (qty <= base) { setIsRestockOpen(false); return; }
      const delta = qty - base;
      await productService.updateStock(selectedProduct.id!, qty);
      await productService.recordStockMovement(selectedProduct.id!, { type: "restock", qty: delta, eventId: currentEventId ?? null, note: "Manual restock (set)" });
      setMovements((prev) => [...prev, { productId: selectedProduct.id!, qty: delta, type: "restock", eventId: currentEventId ?? null, note: "Manual restock (set)", timestamp: new Date().toISOString() }]);
    }
    setIsRestockOpen(false);
    await reloadProducts();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Stock Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Monitor and manage inventory levels</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge>{currentEventName}</Badge>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm">Event view</span>
            <Switch checked={isEventView} onCheckedChange={setIsEventView} />
          </div>
        </div>
      </div>

      {/* Stat Cards - Hidden in event view */}
      {!isEventView && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="text-primary" size={18} />
              </div>
              <Badge className="text-[10px] md:text-xs">Total</Badge>
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">{metrics.totalProducts}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Total Products</p>
          </Card>

          <Card className="p-3 md:p-6">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="text-warning" size={18} />
              </div>
              <Badge variant="secondary" className="text-[10px] md:text-xs">Alert</Badge>
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">{alerts.length}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Low Stock</p>
          </Card>

          <Card className="p-3 md:p-6 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="text-success" size={18} />
              </div>
              <Badge variant="outline" className="text-[10px] md:text-xs">Total</Badge>
            </div>
            <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">₱{metrics.inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Inventory Value</p>
          </Card>
        </div>
      )}

      <Card className="p-3 md:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input placeholder="Search products..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </Card>

      <div className={`${isEventView ? "grid grid-cols-1 place-items-center" : "grid grid-cols-1 lg:grid-cols-2"} gap-4 md:gap-6`}>
        {!isEventView && (
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold">Low Stock Alerts</h2>
              <Badge variant="destructive" className="text-xs">{alerts.length} items</Badge>
            </div>

            <div className="space-y-3 md:space-y-4">
              {alerts.map((p) => (
                <div key={p.id} className="p-3 md:p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-2 md:mb-3">
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">{p.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{p.category}</p>
                    </div>
                    <Badge variant="destructive" className="text-[10px] md:text-xs">Low Stock</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span>Current Stocks: {Number(p.stock ?? 0)}</span>
                      <span className="text-muted-foreground">Reorder: {p.reorderLevel ?? 10}</span>
                    </div>
                    <Progress value={(Number(p.stock ?? 0) / (p.maxStock ?? Math.max(1, Number(p.stock ?? 0)))) * 100} className="h-2" />
                  </div>

                  <Button size="sm" className="w-full mt-2 md:mt-3 text-xs md:text-sm" onClick={() => openRestock(p)}>
                    Restock Now
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className={`p-4 md:p-6 ${isEventView ? "w-full md:max-w-2xl mx-auto" : ""}`}>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Recent Movements</h2>
            <Button variant="outline" size="sm" className="text-xs md:text-sm" onClick={() => setIsMovementsOpen(true)}>View All</Button>
          </div>

          <div className="space-y-3 md:space-y-4">
            {recentMovements.map((movement, index) => (
              <div key={index} className="flex items-start gap-2 md:gap-3 pb-3 md:pb-4 border-b last:border-0">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  movement.type === "in" ? "bg-success/10" : "bg-primary/10"
                }`}>
                  {movement.type === "in" ? (
                    <TrendingUp className="text-success" size={16} />
                  ) : (
                    <TrendingDown className="text-primary" size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{movement.product}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{movement.reason}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">{movement.time}</p>
                </div>
                <Badge variant={movement.type === "in" ? "default" : "secondary"} className="text-xs flex-shrink-0">
                  {movement.type === "in" ? "+" : "-"}{movement.quantity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Restock</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm font-medium">{selectedProduct?.name}</p>
            <div className="text-xs text-muted-foreground">Current: {Number(selectedProduct?.stock ?? 0)} • Reorder: {selectedProduct?.reorderLevel ?? 10}</div>
            <RadioGroup value={restockMode} onValueChange={(v: string) => setRestockMode(v as "add" | "set")} className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-add" value="add" />
                <Label htmlFor="mode-add" className="text-sm">Add Stocks</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="mode-set" value="set" />
                <Label htmlFor="mode-set" className="text-sm">Set Exact</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => { const n = Math.max(0, (parseInt(restockQty || "0", 10) || 0) - 1); setRestockQty(String(n)); }}
              >-</Button>
              <Input type="number" min={0} value={restockQty} onChange={(e) => setRestockQty(e.target.value)} />
              <Button
                variant="outline"
                size="icon"
                onClick={() => { const n = (parseInt(restockQty || "0", 10) || 0) + 1; setRestockQty(String(n)); }}
              >+</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockOpen(false)}>Cancel</Button>
            <Button onClick={submitRestock}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMovementsOpen} onOpenChange={setIsMovementsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>All Stock Movements</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input placeholder="Search product or reason..." className="pl-9" value={movementSearch} onChange={(e) => setMovementSearch(e.target.value)} />
              </div>
              <div>
                <label className="sr-only">Type</label>
                <select className="h-9 w-full border rounded-md px-2 bg-primary/10 border-primary text-primary" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="sale">Sale</option>
                  <option value="restock">Restock</option>
                </select>
              </div>
              <div>
                <label className="sr-only">Product</label>
                <select className="h-9 w-full border rounded-md px-2 bg-primary/10 border-primary text-primary" value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
                  <option value="all">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id as string}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left py-2">Time</th>
                    <th className="text-left py-2">Product</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-left py-2">Qty</th>
                    <th className="text-left py-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((m, idx) => (
                    <tr key={idx} className="border-b last:border-0">
                      <td className="py-2">{m.time}</td>
                      <td className="py-2">{productMap[m.productId]?.name || nameCache[m.productId] || m.product}</td>
                      <td className="py-2">{m.type}</td>
                      <td className="py-2">{m.quantity}</td>
                      <td className="py-2">{m.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMovementsOpen(false)}>Close</Button>
            <Button onClick={() => {
              const rows = filteredMovements;
              const header = ["Time","Product","Type","Qty","Reason"];
              const csv = [header.join(","), ...rows.map(r => [r.time, (productMap[r.productId]?.name || nameCache[r.productId] || r.product).replace(/,/g, " "), r.type, String(r.quantity), r.reason.replace(/,/g, " ")].join(","))].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `movements_${currentEventId || 'all'}.csv`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}>Export CSV</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockManagement;
