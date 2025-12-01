import { useState } from "react";
import { Search, Filter, Plus, Package, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, name: "CoDeS T-Shirt (L)", sku: "CODES-TS-L", category: "Shirts", stock: 45, price: 250, revenue: 11250, status: "Active" },
    { id: 2, name: "CoDeS Lanyard", sku: "CODES-LY-01", category: "Lanyards", stock: 120, price: 50, revenue: 6000, status: "Active" },
    { id: 3, name: "CoDeS Keychain", sku: "CODES-KC-01", category: "Keychains", stock: 5, price: 30, revenue: 900, status: "Active" },
    { id: 4, name: "CoDeS Sticker Pack", sku: "CODES-ST-01", category: "Others", stock: 80, price: 25, revenue: 2000, status: "Active" },
    { id: 5, name: "CoDeS T-Shirt (M)", sku: "CODES-TS-M", category: "Shirts", stock: 32, price: 250, revenue: 8000, status: "Active" },
    { id: 6, name: "CoDeS Mug", sku: "CODES-MG-01", category: "Others", stock: 0, price: 150, revenue: 0, status: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your CoDeS merchandise inventory</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by name, SKU, or category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={20} />
            Filters
          </Button>
          <Button variant="outline">Export</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                      <Package size={20} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{product.stock}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      product.stock > 20 ? "bg-success" : 
                      product.stock > 5 ? "bg-warning" : 
                      product.stock > 0 ? "bg-destructive" : "bg-muted-foreground"
                    }`} />
                  </div>
                </TableCell>
                <TableCell className="font-medium">₱{product.price}</TableCell>
                <TableCell>₱{product.revenue.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit size={16} className="mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Products;