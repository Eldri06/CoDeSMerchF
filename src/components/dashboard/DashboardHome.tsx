
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue"
          value="₱45,230.00"
          change="+12.5%"
          changeType="increase"
          period="vs last event"
          icon={DollarSign}
          color="success"
        />
        <StatCard
          title="Transactions"
          value="1,284"
          change="+8.2%"
          changeType="increase"
          period="vs last event"
          icon={ShoppingBag}
          color="primary"
          subtitle="₱35.25 avg"
        />
        <StatCard
          title="Inventory Value"
          value="₱128,450.00"
          icon={Package}
          color="warning"
          subtitle="248 items"
          alert="12 low stock"
        />
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
