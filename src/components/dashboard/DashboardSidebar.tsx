import { Home, ShoppingCart, Package, Warehouse, Grid, Truck, Calendar, Receipt, DollarSign, BarChart, TrendingUp, GitCompare, Brain, Zap, FileText, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import codesLogo from "@/assets/codes-logo.png";

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const DashboardSidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }: DashboardSidebarProps) => {
  const navStructure = [
    {
      section: "Main",
      items: [
        { id: "dashboard", icon: Home, label: "Dashboard" },
        { id: "pos", icon: ShoppingCart, label: "Point of Sale", badge: "Hot" },
      ]
    },
    {
      section: "Inventory",
      items: [
        { id: "products", icon: Package, label: "Products" },
        { id: "stock", icon: Warehouse, label: "Stock Management" },
        { id: "categories", icon: Grid, label: "Categories" },
        { id: "suppliers", icon: Truck, label: "Suppliers" },
      ]
    },
    {
      section: "Sales & Events",
      items: [
        { id: "events", icon: Calendar, label: "Events" },
        { id: "transactions", icon: Receipt, label: "Transactions" },
        { id: "revenue", icon: DollarSign, label: "Revenue" },
      ]
    },
    {
      section: "Analytics",
      items: [
        { id: "sales-analytics", icon: BarChart, label: "Sales Analytics" },
        { id: "performance", icon: TrendingUp, label: "Performance" },
        { id: "comparison", icon: GitCompare, label: "Event Comparison" },
      ]
    },
    {
      section: "AI & Automation",
      items: [
        { id: "forecasting", icon: Brain, label: "AI Forecasting", badge: "New" },
        { id: "insights", icon: Zap, label: "Insights" },
      ]
    },
    {
      section: "Management",
      items: [
        { id: "reports", icon: FileText, label: "Reports" },
        { id: "team", icon: Users, label: "Team" },
        { id: "settings", icon: Settings, label: "Settings" },
      ]
    }
  ];

  return (
    <aside className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={codesLogo} alt="CoDeS Logo" className="w-10 h-10 flex-shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold gradient-text">CoDeSMerch</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navStructure.map((section) => (
          <div key={section.section}>
            {!collapsed && (
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                {section.section}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />}
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.badge === "Hot" ? "bg-destructive/20 text-destructive" :
                            item.badge === "New" ? "bg-secondary/20 text-secondary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              CO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">CoDeS Officer</p>
              <p className="text-xs text-muted-foreground truncate">Admin</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;