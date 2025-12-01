import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProducts from "@/components/dashboard/TopProducts";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import { DollarSign, ShoppingBag, Package } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Officer!</h1>
        <p className="text-muted-foreground">Here's what's happening with CoDeSMerch today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20">
          <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center flex-shrink-0">
            <DollarSign className="text-success" size={28} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-foreground mb-1">₱45,230</h3>
            <p className="text-sm text-success font-medium">↑ 12.5% vs last event</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="text-primary" size={28} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Transactions</p>
            <h3 className="text-3xl font-bold text-foreground mb-1">1,284</h3>
            <p className="text-sm text-muted-foreground">₱35.25 avg • <span className="text-primary">↑ 8.2%</span></p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20">
          <div className="w-14 h-14 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
            <Package className="text-warning" size={28} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
            <h3 className="text-3xl font-bold text-foreground mb-1">₱128,450</h3>
            <p className="text-sm text-muted-foreground">248 items • <span className="text-destructive">12 low stock</span></p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts />
        <ActivityFeed />
      </div>

      {/* Low Stock Alerts */}
      <LowStockAlerts />
    </div>
  );
};

export default DashboardHome;