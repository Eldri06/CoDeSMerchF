import { Home, ShoppingCart, Package, Warehouse, Calendar, Receipt, DollarSign, BarChart, GitCompare, Brain, FileText, Users, Settings, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import codesLogo from "@/assets/codes-logo.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

interface DashboardSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

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
    ]
  },
  {
    section: "AI & Automation",
    items: [
      { id: "forecasting", icon: Brain, label: "AI Forecasting", badge: "New" },
    ]
  },
  {
    section: "Management",
    items: [
      { id: "team", icon: Users, label: "Team" },
      { id: "settings", icon: Settings, label: "Settings" },
    ]
  }
];

const SidebarContent = ({ 
  activeSection, 
  setActiveSection, 
  collapsed = false,
  onItemClick
}: { 
  activeSection: string; 
  setActiveSection: (section: string) => void;
  collapsed?: boolean;
  onItemClick?: () => void;
}) => (
  <>
    {/* Logo Section */}
    <div className="p-4 md:p-6 border-b border-border">
      <div className="flex items-center gap-3">
        <img src={codesLogo} alt="CoDeS Logo" className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
        {!collapsed && (
          <div>
            <h1 className="text-base md:text-lg font-bold gradient-text">CoDeSMerch</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        )}
      </div>
    </div>

    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
      {(() => {
        const current = authService.getCurrentUser();
        const roleLc = String(current?.systemRole || "").toLowerCase() || "member";
        const memberAllowed = new Set(["dashboard", "products", "events"]);
        const filterItem = (id: string) => {
          if (roleLc === "member") return memberAllowed.has(id);
          return true;
        };
        const filtered = navStructure.map((section) => ({
          ...section,
          items: section.items.filter((i) => filterItem(i.id)).filter((i) => (i.id === "team" ? roleLc !== "member" : true)),
        })).filter((s) => s.items.length > 0);
        return filtered.map((section) => (
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
                  onClick={() => {
                    setActiveSection(item.id);
                    onItemClick?.();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />}
                  <Icon size={18} className="flex-shrink-0" />
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
        ));
      })()}
    </nav>

    {/* User Info */}
    {!collapsed && (
      <div className="p-3 md:p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs md:text-sm">
            CO
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">CoDeS Officer</p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </div>
    )}
  </>
);

const DashboardSidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed }: DashboardSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex bg-card border-r border-border flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}>
        <SidebarContent 
          activeSection={activeSection} 
          setActiveSection={setActiveSection}
          collapsed={collapsed}
        />
        
        {/* Collapse Toggle - Desktop only */}
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
      </aside>

      {/* Mobile Sidebar - Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden fixed top-3 left-3 z-50 bg-card/80 backdrop-blur-sm border border-border shadow-lg"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 bg-card">
          <div className="flex flex-col h-full">
            <SidebarContent 
              activeSection={activeSection} 
              setActiveSection={setActiveSection}
              collapsed={false}
              onItemClick={() => {
                
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default DashboardSidebar;
