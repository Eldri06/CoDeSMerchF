import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProducts from "@/components/dashboard/TopProducts";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import { DollarSign, ShoppingBag, Package, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEventContext } from "@/context/EventContext";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

const DashboardHome = () => {
  const [showChart, setShowChart] = useState(false);
  const { currentEventId } = useEventContext();
  const [products, setProducts] = useState<Array<{ id?: string; price?: number; cost?: number; stock?: number; reorderLevel?: number }>>([]);
  const [txns, setTxns] = useState<Array<{ id?: string; total?: number; createdAt?: string; eventId?: string | null }>>([]);

  useEffect(() => {
    const r = ref(database, "products");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const list = Object.entries(obj).map(([id, p]) => ({ ...(p as any), id }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, any>) : {};
      const list = Object.entries(obj).map(([id, t]) => ({ ...(t as any), id }));
      const filtered = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      setTxns(filtered);
    });
    return () => unsub();
  }, [currentEventId]);

  const totalRevenue = useMemo(() => txns.reduce((sum, t) => sum + Number(t.total || 0), 0), [txns]);
  const totalTransactions = useMemo(() => txns.length, [txns]);
  const avgTransaction = useMemo(() => (totalTransactions ? totalRevenue / totalTransactions : 0), [totalRevenue, totalTransactions]);
  const totalUnits = useMemo(() => products.reduce((sum, p) => sum + Number(p.stock || 0), 0), [products]);
  const lowStockCount = useMemo(() => products.filter((p) => Number(p.stock || 0) <= Number(p.reorderLevel ?? 10)).length, [products]);
  const inventoryValue = useMemo(() => products.reduce((sum, p) => {
    const unitValue = p.cost ?? p.price ?? 0;
    return sum + Number(unitValue) * Number(p.stock || 0);
  }, 0), [products]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Welcome back, Officer!</h1>
        <p className="text-sm md:text-base text-muted-foreground">Here's what's happening with CoDeSMerch today.</p>
      </div>

      {/* Stats Overview - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="text-success" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Total Revenue</p>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">₱{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs md:text-sm text-success font-medium">↑ 12.5% vs last event</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="text-primary" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Transactions</p>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">{totalTransactions.toLocaleString()}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">₱{avgTransaction.toFixed(2)} avg • <span className="text-primary">↑ 8.2%</span></p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Package className="text-warning" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Inventory Value</p>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">₱{inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">{totalUnits.toLocaleString()} items • <span className="text-destructive">{lowStockCount} low stock</span></p>
          </div>
        </div>
      </div>

      {/* Revenue Chart - Hidden on mobile with toggle */}
      <div className="hidden md:block">
        <RevenueChart />
      </div>

      {/* Mobile Chart Toggle */}
      <div className="md:hidden">
        <Collapsible open={showChart} onOpenChange={setShowChart}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-between gap-2 h-12 glass-card border-border/50"
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary" />
                <span className="font-medium">Revenue Chart</span>
              </div>
              {showChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 animate-accordion-down">
            <RevenueChart />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Two Column Section - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <TopProducts />
        <ActivityFeed />
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts />
    </div>
  );
};

export default DashboardHome;
