import { Receipt, Search, Filter, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEventContext } from "@/context/EventContext";
import { transactionService, Transaction, TransactionItem } from "@/services/transactionService";
import { productService } from "@/services/productService";
import { eventService } from "@/services/eventService";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

const Transactions = () => {
  const { currentEventId } = useEventContext();
  interface Row {
    id: string;
    displayId: string;
    date: string;
    event: string;
    items: number;
    amount: number;
    payment: string;
    cashier: string;
    raw: Transaction;
  }
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [eventMap, setEventMap] = useState<Record<string, string>>({});
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());
  const [detailsItems, setDetailsItems] = useState<TransactionItem[]>([]);

  useEffect(() => {
    (async () => {
      if (!currentEventId) {
        const events = await eventService.getAllEvents();
        const map: Record<string, string> = {};
        events.forEach((e) => { if (e.id) map[e.id] = e.name; });
        setEventMap(map);
      }
    })();

    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      const obj = (snap.exists() ? (snap.val() as Record<string, Transaction>) : {});
      const list: Transaction[] = Object.entries(obj).map(([id, t]) => ({ ...t, id }));
      const filteredList = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      setRows(
        filteredList.map((t) => {
          const idStr = String(t.id || "");
          const displayId = idStr ? idStr.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) : "(unsynced)";
          return {
            id: idStr,
            displayId,
            date: new Date(t.createdAt || Date.now()).toLocaleString(),
            event: t.eventId ? (eventMap[t.eventId] || "") : "",
            items: t.items?.length || 0,
            amount: t.total || 0,
            payment: ((t.paymentMethod || "cash") === "cash" ? "Cash" : (t.paymentMethod === "gcash" ? "GCash" : String(t.paymentMethod).toString())) ,
            cashier: t.cashier || "",
            raw: t,
          };
        })
      );
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEventId]);

  useEffect(() => {
    if (!currentEventId && Object.keys(eventMap).length > 0) {
      setRows((prev) => prev.map((r) => ({ ...r, event: r.raw.eventId ? (eventMap[r.raw.eventId] || "") : "" })));
    }
  }, [eventMap, currentEventId]);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();
    let interval: ReturnType<typeof setInterval> | null = null;
    const timeout = setTimeout(() => {
      setNowTick(Date.now());
      interval = setInterval(() => setNowTick(Date.now()), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedTxn) { setDetailsItems([]); return; }
      const base = selectedTxn.items || [];
      const needsLookup = base.some((it) => !it.sku);
      if (!needsLookup) { setDetailsItems(base); return; }
      const allProducts = await productService.getAllProducts();
      const byId: Record<string, string> = Object.fromEntries(allProducts.map((p) => [String(p.id || ""), p.sku]));
      const byName: Record<string, string> = Object.fromEntries(allProducts.map((p) => [String(p.name || ""), p.sku]));
      const enriched = base.map((it) => {
        if (it.sku) return it;
        const fromId = byId[String(it.productId)] || "";
        const fromName = byName[String(it.name)] || "";
        return { ...it, sku: fromId || fromName || it.sku };
      });
      setDetailsItems(enriched);
    })();
  }, [selectedTxn]);

  const filtered = useMemo(() => {
    let list = [...rows];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => String(r.id).toLowerCase().includes(q) || String(r.displayId).toLowerCase().includes(q));
    }
    const hasFrom = Boolean(dateFrom);
    const hasTo = Boolean(dateTo);
    if (hasFrom || hasTo) {
      const fromTime = hasFrom ? new Date(dateFrom + "T00:00:00").getTime() : -Infinity;
      const toTime = hasTo ? new Date(dateTo + "T23:59:59").getTime() : Infinity;
      list = list.filter((r) => {
        const t = r.raw.createdAt ? new Date(r.raw.createdAt).getTime() : 0;
        return t >= fromTime && t <= toTime;
      });
    }
    return list;
  }, [rows, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const isSameDay = (d: Date) => {
      const now = new Date(nowTick);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    };
    const totalTransactions = filtered.length;
    const totalAmount = filtered.reduce((sum, r) => sum + Number(r.amount || 0), 0);
    const avgSale = totalTransactions ? totalAmount / totalTransactions : 0;
    const itemsSold = filtered.reduce(
      (sum, r) => sum + (r.raw.items?.reduce((acc, it) => acc + Number(it.quantity || 0), 0) || 0),
      0,
    );
    const todaysSales = filtered.reduce((sum, r) => {
      const createdAt = r.raw.createdAt ? new Date(r.raw.createdAt) : null;
      if (createdAt && isSameDay(createdAt)) return sum + Number(r.amount || 0);
      return sum;
    }, 0);
    return { todaysSales, totalTransactions, avgSale, itemsSold };
  }, [filtered, nowTick]);

  const DetailsDialog = () => (
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>
        {selectedTxn ? (
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted-foreground">Transaction</p>
                <p className="font-mono font-medium">{selectedTxn.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{new Date(selectedTxn.createdAt || Date.now()).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Event</p>
                <p>{selectedTxn.eventId ? (eventMap[selectedTxn.eventId] || "") : "All Events"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment</p>
                <p>{(selectedTxn.paymentMethod === "cash" ? "Cash" : selectedTxn.paymentMethod === "gcash" ? "GCash" : String(selectedTxn.paymentMethod || "")).toString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Cashier</p>
                <p>{selectedTxn.cashier || ""}</p>
              </div>
            </div>
            <div className="border-t pt-2 space-y-1">
              {detailsItems.map((it: TransactionItem, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate">{it.name} × {it.quantity}</span>
                  <span>₱{Number(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              {detailsItems.map((it: TransactionItem, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span className="truncate">SKU: {it.sku || "-"}</span>
                  <span />
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₱{Number(selectedTxn.subtotal || 0).toFixed(2)}</span></div>
              <div className="flex justify-between font-bold"><span>Total</span><span>₱{Number(selectedTxn.total || 0).toFixed(2)}</span></div>
            </div>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Transactions</h1>
          <p className="text-sm md:text-base text-muted-foreground">View all sales transactions</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={() => {
          const headers = ["id","date","event","items","amount","payment","cashier"];
          const rowsCsv = filtered.map(r => [r.id,r.date,r.event,r.items,r.amount,r.payment,r.cashier]);
          const csv = [headers.join(","), ...rowsCsv.map(rr => rr.map((v) => String(v).replace(/,/g, " ")).join(","))].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `transactions_${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        }}>
          <Download size={18} />
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Stat Cards - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Today's Sales</p>
          <h3 className="text-lg md:text-2xl font-bold">₱{stats.todaysSales.toFixed(2)}</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Total Trans.</p>
          <h3 className="text-lg md:text-2xl font-bold">{stats.totalTransactions}</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Average Sale</p>
          <h3 className="text-lg md:text-2xl font-bold">₱{stats.avgSale.toFixed(2)}</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Items Sold</p>
          <h3 className="text-lg md:text-2xl font-bold">{stats.itemsSold}</h3>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        {/* Search & Filter */}
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search transactions..."
              className="pl-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-sm" />
            <span className="text-muted-foreground text-sm">to</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-sm" />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter size={18} />
          </Button>
        </div>
        <div className="md:hidden grid grid-cols-2 gap-2 mb-4">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-sm" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-sm" />
        </div>

        {/* Mobile Transaction Cards */}
        <div className="md:hidden space-y-3">
          {filtered.map((txn) => (
            <div key={txn.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono font-medium text-sm">{txn.displayId}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <p className="font-bold text-primary">₱{txn.amount}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {txn.event && <Badge variant="secondary" className="text-[10px]">{txn.event}</Badge>}
                <Badge variant={txn.payment === "Cash" ? "default" : "outline"} className="text-[10px]">
                  {txn.payment}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{txn.items} items • {txn.cashier}</span>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => { setSelectedTxn(txn.raw); setIsDetailsOpen(true); }}>
                  <Receipt size={14} className="mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Event</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Cashier</th>
                <th className="text-right py-3 px-4 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono font-medium">{txn.displayId}</td>
                  <td className="py-3 px-4">{txn.date}</td>
                  <td className="py-3 px-4">
                    {txn.event && <Badge variant="secondary">{txn.event}</Badge>}
                  </td>
                  <td className="py-3 px-4">{txn.items} items</td>
                  <td className="py-3 px-4 font-bold">₱{txn.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={txn.payment === "Cash" ? "default" : "outline"}>
                      {txn.payment}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{txn.cashier}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedTxn(txn.raw); setIsDetailsOpen(true); }}>
                      <Receipt size={16} className="mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DetailsDialog />
      </Card>
    </div>
  );
};

export default Transactions;
