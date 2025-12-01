import { Receipt, Search, Filter, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Transactions = () => {
  const transactions = [
    { id: "TXN-001234", date: "Jan 20, 2025 10:30 AM", event: "Intramurals 2025", items: 3, amount: 750, payment: "Cash", cashier: "Juan DC" },
    { id: "TXN-001235", date: "Jan 20, 2025 11:15 AM", event: "Intramurals 2025", items: 2, amount: 500, payment: "GCash", cashier: "Maria S" },
    { id: "TXN-001236", date: "Jan 20, 2025 02:45 PM", event: "Intramurals 2025", items: 5, amount: 1250, payment: "Cash", cashier: "Juan DC" },
    { id: "TXN-001237", date: "Jan 19, 2025 03:20 PM", event: "ICT Week 2024", items: 1, amount: 250, payment: "Cash", cashier: "Pedro R" },
    { id: "TXN-001238", date: "Jan 19, 2025 04:10 PM", event: "ICT Week 2024", items: 4, amount: 920, payment: "GCash", cashier: "Maria S" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">View all sales transactions</p>
        </div>
        <Button className="gap-2">
          <Download size={20} />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Today's Sales</p>
          <h3 className="text-2xl font-bold">₱2,500</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
          <h3 className="text-2xl font-bold">1,284</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Average Sale</p>
          <h3 className="text-2xl font-bold">₱625</h3>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Items Sold</p>
          <h3 className="text-2xl font-bold">3,842</h3>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by transaction ID, event, or cashier..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={20} />
            Filter
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Cashier</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-mono font-medium">{txn.id}</TableCell>
                <TableCell>{txn.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{txn.event}</Badge>
                </TableCell>
                <TableCell>{txn.items} items</TableCell>
                <TableCell className="font-bold">₱{txn.amount}</TableCell>
                <TableCell>
                  <Badge variant={txn.payment === "Cash" ? "default" : "outline"}>
                    {txn.payment}
                  </Badge>
                </TableCell>
                <TableCell>{txn.cashier}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Receipt size={16} className="mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Transactions;