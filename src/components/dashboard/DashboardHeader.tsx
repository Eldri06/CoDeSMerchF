import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 z-10">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search products, transactions, events... (Ctrl+K)"
            className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Event Selector */}
        <Button variant="outline" className="gap-2 border-border/50 hover:border-primary">
          <span className="text-sm font-medium">Intramurals 2025</span>
          <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">Live</span>
          <ChevronDown size={16} />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" title="Notifications">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        {/* User Profile */}
        <Button variant="ghost" className="gap-2 pl-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
            CO
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium leading-none">CoDeS Officer</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <ChevronDown size={16} className="text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;