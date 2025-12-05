import { FileText, Download, Calendar, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const recentReports = [
    {
      name: "Sales Summary - Intramurals 2025",
      type: "Sales Report",
      date: "Jan 20, 2025",
      size: "245 KB",
      format: "PDF",
      status: "Ready",
    },
    {
      name: "Inventory Valuation - Q1 2025",
      type: "Inventory Report",
      date: "Jan 15, 2025",
      size: "180 KB",
      format: "Excel",
      status: "Ready",
    },
    {
      name: "Event Performance - ICT Week",
      type: "Event Report",
      date: "Dec 28, 2024",
      size: "320 KB",
      format: "PDF",
      status: "Ready",
    },
    {
      name: "Forecast Accuracy - December",
      type: "AI Report",
      date: "Dec 20, 2024",
      size: "156 KB",
      format: "PDF",
      status: "Ready",
    },
  ];

  const reportTypes = [
    { name: "Sales Summary", description: "Complete sales breakdown", icon: "📊" },
    { name: "Inventory Report", description: "Stock levels & values", icon: "📦" },
    { name: "Event Performance", description: "Event analysis", icon: "🎪" },
    { name: "Profit & Loss", description: "Financial statements", icon: "💰" },
    { name: "Forecast Report", description: "AI predictions", icon: "🔮" },
    { name: "Cashier Performance", description: "Staff metrics", icon: "👤" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Reports</h1>
          <p className="text-sm md:text-base text-muted-foreground">Generate and manage system reports</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Generate Report
        </Button>
      </div>

      {/* Report Types Grid - 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {reportTypes.map((type, index) => (
          <Card key={index} className="p-3 md:p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-2xl md:text-4xl mb-2 md:mb-4">{type.icon}</div>
            <h3 className="font-bold text-sm md:text-lg mb-1 md:mb-2">{type.name}</h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">{type.description}</p>
            <Button variant="outline" className="w-full text-xs md:text-sm" size="sm">
              Generate
            </Button>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold">Recent Reports</h2>
          <Button variant="outline" size="sm" className="text-xs md:text-sm">View All</Button>
        </div>

        {/* Mobile Report Cards */}
        <div className="md:hidden space-y-3">
          {recentReports.map((report, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-primary" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{report.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <Badge variant="secondary" className="text-[10px]">{report.type}</Badge>
                  <Badge variant="outline" className="text-[10px]">{report.format}</Badge>
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">View</Button>
                  <Button size="sm" className="h-7 px-2 text-xs gap-1">
                    <Download size={12} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Report List */}
        <div className="hidden md:block space-y-4">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="text-primary" size={24} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">{report.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {report.date}
                  </span>
                  <Badge variant="secondary">{report.type}</Badge>
                  <span>{report.size}</span>
                  <Badge variant="outline">{report.format}</Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button size="sm" className="gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;