import { useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProducts from "@/components/dashboard/TopProducts";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import { DollarSign, ShoppingBag, Package, ChevronDown, ChevronUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DashboardHome = () => {
  const [showChart, setShowChart] = useState(false);

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
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">₱45,230</h3>
            <p className="text-xs md:text-sm text-success font-medium">↑ 12.5% vs last event</p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="text-primary" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Transactions</p>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">1,284</h3>
            <p className="text-xs md:text-sm text-muted-foreground">₱35.25 avg • <span className="text-primary">↑ 8.2%</span></p>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 sm:col-span-2 lg:col-span-1">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Package className="text-warning" size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Inventory Value</p>
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">₱128,450</h3>
            <p className="text-xs md:text-sm text-muted-foreground">248 items • <span className="text-destructive">12 low stock</span></p>
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