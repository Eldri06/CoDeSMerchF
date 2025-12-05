import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <header className="h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 z-10">
      {/* Search Bar */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl ml-10 md:ml-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-background/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Event Selector - Hidden on mobile */}
        <Button variant="outline" className="hidden sm:flex gap-2 border-border/50 hover:border-primary">
          <span className="text-sm font-medium">Intramurals 2025</span>
          <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">Live</span>
          <ChevronDown size={16} />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9" title="Notifications">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        {/* User Profile - Simplified on mobile */}
        <Button variant="ghost" className="gap-1 md:gap-2 pl-1 md:pl-2 h-9">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
            CO
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium leading-none">CoDeS Officer</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;