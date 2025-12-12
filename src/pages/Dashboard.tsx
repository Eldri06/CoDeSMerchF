import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardHome from "@/components/dashboard/DashboardHome";
import POS from "./dashboard/POS";
import Products from "./dashboard/Products";
import StockManagement from "./dashboard/StockManagement";
import Events from "./dashboard/Events";
import Transactions from "./dashboard/Transactions";
import Revenue from "./dashboard/Revenue";
import SalesAnalytics from "./dashboard/SalesAnalytics";
import Forecasting from "./dashboard/Forecasting";
import Reports from "./dashboard/Reports";
import Team from "./dashboard/Team";
import Settings from "./dashboard/Settings";
import { useEffect } from "react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const section = String(detail.section || "");
      if (section) {
        setActiveSection(section);
        if (detail.productSearch) {
          localStorage.setItem("productSearch", String(detail.productSearch));
        }
      }
    };
    window.addEventListener("dashboard:navigate", handler as EventListener);
    return () => window.removeEventListener("dashboard:navigate", handler as EventListener);
  }, []);

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
        
        <main className="flex-1 overflow-y-auto p-3 md:p-6 pt-16 md:pt-6">
          {activeSection === "dashboard" && <DashboardHome />}
          {activeSection === "pos" && <POS />}
          {activeSection === "products" && <Products />}
          {activeSection === "stock" && <StockManagement />}
          {activeSection === "events" && <Events />}
          {activeSection === "transactions" && <Transactions />}
          {activeSection === "revenue" && <Revenue />}
          {activeSection === "sales-analytics" && <SalesAnalytics />}
          {activeSection === "forecasting" && <Forecasting />}
          {activeSection === "reports" && <Reports />}
          {activeSection === "team" && <Team />}
          {activeSection === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
