import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHome from "@/components/dashboard/DashboardHome";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === "dashboard" && <DashboardHome />}
          {activeSection === "pos" && <div className="text-muted-foreground">POS Module - Coming Soon</div>}
          {activeSection === "inventory" && <div className="text-muted-foreground">Inventory Module - Coming Soon</div>}
          {/* Add other sections as needed */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;