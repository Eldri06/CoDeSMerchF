import { Package, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const StockManagement = () => {
  const lowStockItems = [
    { name: "CoDeS Keychain", current: 5, reorder: 10, max: 50, category: "Keychains" },
    { name: "CoDeS T-Shirt (XL)", current: 8, reorder: 15, max: 40, category: "Shirts" },
    { name: "CoDeS Notebook", current: 3, reorder: 10, max: 30, category: "Others" },
  ];

  const recentMovements = [
    { product: "CoDeS T-Shirt (L)", type: "out", quantity: 5, reason: "Sale - Intramurals", time: "2 hours ago" },
    { product: "CoDeS Lanyard", type: "in", quantity: 50, reason: "Restock from Supplier", time: "5 hours ago" },
    { product: "CoDeS Mug", type: "out", quantity: 3, reason: "Sale - Foundation Week", time: "1 day ago" },
    { product: "CoDeS Sticker Pack", type: "in", quantity: 100, reason: "New Stock", time: "2 days ago" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Stock Management</h1>
        <p className="text-sm md:text-base text-muted-foreground">Monitor and manage inventory levels</p>
      </div>

      {/* Stat Cards - 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Card className="p-3 md:p-6">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="text-primary" size={18} />
            </div>
            <Badge className="text-[10px] md:text-xs">Total</Badge>
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">248</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Total Items</p>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="text-warning" size={18} />
            </div>
            <Badge variant="secondary" className="text-[10px] md:text-xs">Alert</Badge>
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">12</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Low Stock</p>
        </Card>

        <Card className="p-3 md:p-6 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center">
              <TrendingUp className="text-success" size={18} />
            </div>
            <Badge variant="outline" className="text-[10px] md:text-xs">This Month</Badge>
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">₱128,450</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Inventory Value</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Low Stock Alerts</h2>
            <Badge variant="destructive" className="text-xs">{lowStockItems.length} items</Badge>
          </div>

          <div className="space-y-3 md:space-y-4">
            {lowStockItems.map((item, index) => (
              <div key={index} className="p-3 md:p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2 md:mb-3">
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">{item.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge variant="destructive" className="text-[10px] md:text-xs">Low Stock</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs md:text-sm">
                    <span>Current: {item.current} units</span>
                    <span className="text-muted-foreground">Reorder: {item.reorder}</span>
                  </div>
                  <Progress value={(item.current / item.max) * 100} className="h-2" />
                </div>

                <Button size="sm" className="w-full mt-2 md:mt-3 text-xs md:text-sm">
                  Restock Now
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Recent Movements</h2>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">View All</Button>
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
    </div>
  );
};

export default StockManagement;