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
    { name: "Sales Summary", description: "Complete sales breakdown with trends", icon: "📊" },
    { name: "Inventory Report", description: "Stock levels and valuations", icon: "📦" },
    { name: "Event Performance", description: "Detailed event analysis", icon: "🎪" },
    { name: "Profit & Loss", description: "Financial statements", icon: "💰" },
    { name: "Forecast Report", description: "AI predictions and accuracy", icon: "🔮" },
    { name: "Cashier Performance", description: "Staff productivity metrics", icon: "👤" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Generate and manage system reports</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((type, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer">
            <div className="text-4xl mb-4">{type.icon}</div>
            <h3 className="font-bold text-lg mb-2">{type.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
            <Button variant="outline" className="w-full">
              Generate
            </Button>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Recent Reports</h2>
          <Button variant="outline" size="sm">View All</Button>
        </div>

        <div className="space-y-4">
          {recentReports.map((report, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="text-primary" size={24} />
              </div>

              <div className="flex-1">
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
                <Button variant="outline" size="sm">
                  View
                </Button>
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