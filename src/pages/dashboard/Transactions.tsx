import { Receipt, Search, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Transactions = () => {
  const transactions = [
    { id: "TXN-001234", date: "Jan 20, 2025 10:30 AM", event: "Intramurals 2025", items: 3, amount: 750, payment: "Cash", cashier: "Juan DC" },
    { id: "TXN-001235", date: "Jan 20, 2025 11:15 AM", event: "Intramurals 2025", items: 2, amount: 500, payment: "GCash", cashier: "Maria S" },
    { id: "TXN-001236", date: "Jan 20, 2025 02:45 PM", event: "Intramurals 2025", items: 5, amount: 1250, payment: "Cash", cashier: "Juan DC" },
    { id: "TXN-001237", date: "Jan 19, 2025 03:20 PM", event: "ICT Week 2024", items: 1, amount: 250, payment: "Cash", cashier: "Pedro R" },
    { id: "TXN-001238", date: "Jan 19, 2025 04:10 PM", event: "ICT Week 2024", items: 4, amount: 920, payment: "GCash", cashier: "Maria S" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Transactions</h1>
          <p className="text-sm md:text-base text-muted-foreground">View all sales transactions</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Download size={18} />
          <span className="hidden sm:inline">Export Report</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </div>

      {/* Stat Cards - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Today's Sales</p>
          <h3 className="text-lg md:text-2xl font-bold">₱2,500</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Total Trans.</p>
          <h3 className="text-lg md:text-2xl font-bold">1,284</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Average Sale</p>
          <h3 className="text-lg md:text-2xl font-bold">₱625</h3>
        </Card>
        <Card className="p-3 md:p-6">
          <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1">Items Sold</p>
          <h3 className="text-lg md:text-2xl font-bold">3,842</h3>
        </Card>
      </div>

      <Card className="p-4 md:p-6">
        {/* Search & Filter */}
        <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search transactions..."
              className="pl-10 text-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter size={18} />
          </Button>
        </div>

        {/* Mobile Transaction Cards */}
        <div className="md:hidden space-y-3">
          {transactions.map((txn) => (
            <div key={txn.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-mono font-medium text-sm">{txn.id}</p>
                  <p className="text-xs text-muted-foreground">{txn.date}</p>
                </div>
                <p className="font-bold text-primary">₱{txn.amount}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">{txn.event}</Badge>
                <Badge variant={txn.payment === "Cash" ? "default" : "outline"} className="text-[10px]">
                  {txn.payment}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{txn.items} items • {txn.cashier}</span>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Receipt size={14} className="mr-1" />
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Event</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Items</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Payment</th>
                <th className="text-left py-3 px-4 text-sm font-medium">Cashier</th>
                <th className="text-right py-3 px-4 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-mono font-medium">{txn.id}</td>
                  <td className="py-3 px-4">{txn.date}</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary">{txn.event}</Badge>
                  </td>
                  <td className="py-3 px-4">{txn.items} items</td>
                  <td className="py-3 px-4 font-bold">₱{txn.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={txn.payment === "Cash" ? "default" : "outline"}>
                      {txn.payment}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">{txn.cashier}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      <Receipt size={16} className="mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Transactions;