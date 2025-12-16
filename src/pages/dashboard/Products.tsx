// src/pages/dashboard/Products.tsx
// FIXED: Add Product button now actually opens dialog
import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, Plus, Package, Edit, Trash2, MoreVertical, X } from "lucide-react";
import { exportExcel } from "@/utils/exportExcel";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { productService, Product } from "@/services/productService";
import { Transaction, TransactionItem } from "@/services/transactionService";
import { database } from "@/config/firebase";
import { createClient } from "@supabase/supabase-js";
import { onValue, ref } from "firebase/database";
import { useEventContext } from "@/context/EventContext";
import { formatCurrency, getGeneralSettings } from "@/lib/utils";
import { authService } from "@/services/authService";

const Products = () => {
  const API_URL = import.meta.env.VITE_API_URL || '/api';
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [revenueByProduct, setRevenueByProduct] = useState<Record<string, number>>({});
  const [itemsSoldByProduct, setItemsSoldByProduct] = useState<Record<string, number>>({});

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [adjustQty, setAdjustQty] = useState<string>("0");
  const [adjustMode, setAdjustMode] = useState<"add" | "set">("add");
  
  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { currentEventId, currentEventName } = useEventContext();
  const currentUser = authService.getCurrentUser();
  const roleLabel = String(currentUser?.systemRole || currentUser?.role || "member").trim().toLowerCase();
  const canManage = roleLabel !== "member";

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "Shirts",
    description: "",
    imageUrl: "",
    imagePath: "",
    price: "",
    cost: "",
    stock: "",
    reorderLevel: "10",
    maxStock: "100",
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingEditImage, setUploadingEditImage] = useState(false);

  const categories = ["Shirts", "Lanyards", "Keychains", "Stickers", "Mugs", "Others"];

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    const preset = localStorage.getItem("productSearch") || "";
    if (preset) {
      setSearchQuery(preset);
      localStorage.removeItem("productSearch");
    }
  }, []);

  const displayedProducts = useMemo(() => {
    const norm = (v: string | null | undefined) => String(v || "").trim().toLowerCase();
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => 
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    if (currentEventId) {
      const candId = norm(currentEventId);
      const idMatches = (p: Product) => {
        if ((p.eventId ?? null) && norm(p.eventId as string) === candId) return true;
        const keys = Object.keys(p.stockByEvent || {});
        return keys.some((k) => norm(k) === candId);
      };
      filtered = filtered.filter(idMatches).map((p) => {
        const keys = Object.keys(p.stockByEvent || {});
        const mk = keys.find((k) => norm(k) === candId);
        if (mk) return { ...p, stock: Number(p.stockByEvent?.[mk] ?? 0) } as Product;
        if ((p.eventId ?? null) && norm(p.eventId as string) === candId) return { ...p, stock: Number(p.stock ?? 0) } as Product;
        return { ...p, stock: 0 } as Product;
      });
    }

    return filtered;
  }, [products, selectedCategory, selectedStatus, searchQuery, currentEventId]);

  useEffect(() => {
    const r = ref(database, "transactions");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, Transaction>) : {};
      const list: Transaction[] = Object.entries(obj).map(([id, t]) => ({ ...t, id }));
      const filtered = currentEventId ? list.filter((t) => (t.eventId ?? null) === currentEventId) : list;
      const rev: Record<string, number> = {};
      const sold: Record<string, number> = {};
      filtered.forEach((t) => {
        const items: TransactionItem[] = Array.isArray(t.items) ? (t.items as TransactionItem[]) : [];
        items.forEach((it: TransactionItem) => {
          const pid = String(it.productId || "");
          const qty = Number(it.quantity || 0);
          const amt = Number(it.price || 0) * qty;
          rev[pid] = (rev[pid] || 0) + amt;
          sold[pid] = (sold[pid] || 0) + qty;
        });
      });
      setRevenueByProduct(rev);
      setItemsSoldByProduct(sold);
    });
    return () => unsub();
  }, [currentEventId]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await productService.getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };

  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤ 5MB"); return; }
    
    setUploadingImage(true);
    try {
      if (!supabase) throw new Error("Supabase not configured");
      const safeSku = (formData.sku || "product").replace(/[^a-zA-Z0-9-_]/g, "_");
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `products/${safeSku}-${Date.now()}.${ext}`;
      const bucket = "product-images";

      // Upload directly to Supabase
      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { contentType: file.type, upsert: true });

      if (uploadErr) {
        // Try creating bucket if it doesn't exist (requires admin/service role)
        if (uploadErr.message.includes("bucket") || uploadErr.message.includes("not found")) {
           try {
             await supabase.storage.createBucket(bucket, { public: true });
             const { error: retryErr } = await supabase.storage
               .from(bucket)
               .upload(path, file, { contentType: file.type, upsert: true });
             if (retryErr) throw retryErr;
           } catch {
             throw uploadErr;
           }
        } else {
          throw uploadErr;
        }
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const url = data?.publicUrl || "";
      
      setFormData({ ...formData, imageUrl: url, imagePath: path });
      toast.success("Image uploaded");
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to upload image: ${err.message || "Unknown error"}`);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleEditImagePick = () => {
    editFileInputRef.current?.click();
  };

  const handleEditImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be ≤ 5MB"); return; }
    
    setUploadingEditImage(true);
    try {
      const safeSku = (String(editData.sku || selectedProduct?.sku || 'product')).replace(/[^a-zA-Z0-9-_]/g, '_');
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = `products/${safeSku}-${Date.now()}.${ext}`;
      const bucket = 'product-images';
      try {
        await fetch(`${API_URL}/storage/ensure-bucket`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bucketName: bucket, public: true })
        });
      } catch { void 0; }
      const fd = new FormData();
      fd.append('file', file);
      fd.append('bucket', bucket);
      fd.append('path', path);
      const resp = await fetch(`${API_URL}/storage/upload`, { method: 'POST', body: fd });
      const payload = await resp.json();
      if (!resp.ok || !payload.success) {
        toast.error(`Upload failed: ${payload.error || resp.statusText}`);
      } else {
        const url = String(payload.url || '');
        setEditData((prev) => ({ ...prev, imageUrl: url, imagePath: path }));
        toast.success("Image uploaded");
      }
    } catch (err) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingEditImage(false);
      if (editFileInputRef.current) editFileInputRef.current.value = "";
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      category: "Shirts",
      description: "",
      imageUrl: "",
      imagePath: "",
      price: "",
      cost: "",
      stock: "",
      reorderLevel: "10",
      maxStock: "100",
    });
  };

  const handleAddProduct = async () => {
    if (!canManage) { toast.error("You don't have permission to create products"); return; }
    console.log("🔵 Add Product button clicked!");
    
    if (!validateForm()) {
      console.log("❌ Validation failed");
      return;
    }

    setIsSubmitting(true);
    console.log("🔄 Creating product...", formData);

    const productData = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      category: formData.category,
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      cost: formData.cost ? parseFloat(formData.cost) : 0,
      stock: parseInt(formData.stock),
      reorderLevel: parseInt(formData.reorderLevel) || 10,
      maxStock: parseInt(formData.maxStock) || 100,
      eventId: currentEventId ?? null,
      status: parseInt(formData.stock) > 0 ? "Active" as const : "Out of Stock" as const,
    };

    if (formData.imageUrl && formData.imageUrl.trim() !== "") {
      (productData as typeof productData & { imageUrl?: string }).imageUrl = formData.imageUrl.trim();
    }
    if (formData.imagePath && formData.imagePath.trim() !== "") {
      (productData as typeof productData & { imagePath?: string }).imagePath = formData.imagePath.trim();
    }

    const result = await productService.createProduct(productData);
    console.log("📥 Result:", result);

    if (result.success) {
      toast.success(result.message);
      setIsAddDialogOpen(false);
      resetForm();
      loadProducts();
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!canManage) { toast.error("You don't have permission to delete products"); return; }
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    const result = await productService.deleteProduct(productId);

    if (result.success) {
      toast.success(result.message);
      loadProducts();
    } else {
      toast.error(result.message);
    }
  };

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedStatus !== "all" ? 1 : 0);

  // FIXED: Simple test button
  const testButton = () => {
    console.log("TEST BUTTON CLICKED!");
    alert("Button works! Dialog state: " + isAddDialogOpen);
    if (canManage) setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your CoDeS merchandise inventory</p>
        </div>
        
        {/* Create Product available only to non-member roles */}
        {canManage && (
          <Button 
            className="gap-2" 
            onClick={() => {
              console.log("🟢 Add Product button clicked - opening dialog");
              setIsAddDialogOpen(true);
            }}
            type="button"
          >
            <Plus size={20} />
            Add Product
          </Button>
        )}
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by name, SKU, or category..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline"
            className="gap-2"
            onClick={async () => {
              const columns = [
                { header: "ID", key: "id" },
                { header: "Name", key: "name" },
                { header: "SKU", key: "sku" },
                { header: "Category", key: "category" },
                { header: "Price", key: "price" },
                { header: "Stock", key: "stock" },
                { header: "Status", key: "status" },
                { header: "Event", key: "eventId" },
                { header: "Created", key: "createdAt" },
                { header: "Updated", key: "updatedAt" },
              ];
              const rows = displayedProducts.map((p) => ({
                id: p.id,
                name: p.name,
                sku: p.sku,
                category: p.category,
                price: p.price,
                stock: p.stock,
                status: p.status,
                eventId: p.eventId ?? "",
                createdAt: p.createdAt ?? "",
                updatedAt: p.updatedAt ?? "",
              }));
              const subtitle = `Exported: ${new Date().toLocaleString()} | Category: ${selectedCategory === "all" ? "All" : selectedCategory}`;
              await exportExcel({ filename: `products_${Date.now()}`, title: "Products", columns, rows, subtitle, includeTitleColumn: true, titleColumnName: "Title", titleValue: "Products List", currencyKeys: ["price"], dateKeys: ["createdAt","updatedAt"] });
            }}
            type="button"
          >
            Export Excel
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              type="button"
            >
              <Filter size={20} />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {isFilterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsFilterOpen(false)}
                    type="button"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1" 
                      onClick={resetFilters}
                      type="button"
                    >
                      Reset
                    </Button>
                    <Button 
                      className="flex-1" 
                      onClick={() => setIsFilterOpen(false)}
                      type="button"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
            {selectedStatus !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Status: {selectedStatus}
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => setSelectedStatus("all")}
                />
              </Badge>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : displayedProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {products.length === 0 ? (
              <>No products found. Click "Add Product" to create one.</>
            ) : (
              <>No products match your filters. Try adjusting your search or filters.</>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Items Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                {canManage && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
              <TableBody>
              {displayedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-muted-foreground" />
                        )}
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
                  <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                  <TableCell>{Number(itemsSoldByProduct[product.id || ""] || 0)}</TableCell>
                  <TableCell>{formatCurrency(Number(revenueByProduct[product.id || ""] || 0))}</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "Active" ? "default" : "destructive"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  {canManage ? (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" type="button">
                            <MoreVertical size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedProduct(product); setEditData({ name: product.name, sku: product.sku, category: product.category, price: product.price, cost: product.cost, reorderLevel: product.reorderLevel, maxStock: product.maxStock, status: product.status }); setIsEditOpen(true); }}>
                            <Edit size={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedProduct(product); setIsDetailsOpen(true); }}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedProduct(product); setAdjustQty("0"); setAdjustMode("add"); setIsAdjustOpen(true); }}>Adjust Stock</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id!, product.name)}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : (
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" type="button" onClick={() => { setSelectedProduct(product); setIsDetailsOpen(true); }}>
                        View Details
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* FIXED: Dialog with proper state management */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product in your CoDeS merchandise inventory
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="CoDeS T-Shirt (Large)"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="CODES-TS-L"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Selling Price ({getGeneralSettings().currency === 'USD' ? '$' : '₱'}) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="250.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost Price ({getGeneralSettings().currency === 'USD' ? '$' : '₱'})</Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="150.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="stock">Initial Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="50"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reorderLevel">Reorder Level</Label>
              <Input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={handleInputChange}
                placeholder="10"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxStock">Maximum Stock</Label>
              <Input
                id="maxStock"
                name="maxStock"
                type="number"
                min="0"
                value={formData.maxStock}
                onChange={handleInputChange}
                placeholder="100"
                className="mt-1"
              />
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
              <Button type="button" onClick={handleImagePick} disabled={uploadingImage}>
                {uploadingImage ? "Uploading..." : formData.imageUrl ? "Change Image" : "Upload Image"}
              </Button>
              {formData.imageUrl && (
                <div className="w-12 h-12 rounded overflow-hidden border border-border">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product description..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={isSubmitting} type="button">
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen && canManage} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input ref={editFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleEditImageFileChange} />
              <Button type="button" onClick={handleEditImagePick} disabled={uploadingEditImage || !canManage}>
                {uploadingEditImage ? "Uploading..." : (editData.imageUrl || selectedProduct?.imageUrl) ? "Change Image" : "Upload Image"}
              </Button>
              {(editData.imageUrl || selectedProduct?.imageUrl) && (
                <div className="w-12 h-12 rounded overflow-hidden border border-border">
                  <img src={String(editData.imageUrl || selectedProduct?.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={String(editData.name || "")} onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={String(editData.sku || "")} onChange={(e) => setEditData((prev) => ({ ...prev, sku: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={String(editData.category || "")} onValueChange={(v) => setEditData((prev) => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" min={0} step={0.01} value={String(editData.price ?? "")} onChange={(e) => setEditData((prev) => ({ ...prev, price: Number(e.target.value || 0) }))} />
              </div>
              <div className="space-y-2">
                <Label>Cost</Label>
                <Input type="number" min={0} step={0.01} value={String(editData.cost ?? "")} onChange={(e) => setEditData((prev) => ({ ...prev, cost: Number(e.target.value || 0) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Reorder Level</Label>
                <Input type="number" min={0} value={String(editData.reorderLevel ?? "")} onChange={(e) => setEditData((prev) => ({ ...prev, reorderLevel: Number(e.target.value || 0) }))} />
              </div>
              <div className="space-y-2">
                <Label>Max Stock</Label>
                <Input type="number" min={0} value={String(editData.maxStock ?? "")} onChange={(e) => setEditData((prev) => ({ ...prev, maxStock: Number(e.target.value || 0) }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={String(editData.status || "Active")} onValueChange={(v) => setEditData((prev) => ({ ...prev, status: v as Product["status"] }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              if (!selectedProduct?.id) return;
              const res = await productService.updateProduct(selectedProduct.id, editData);
              if (!canManage) return;
              if (res.success) { setIsEditOpen(false); setSelectedProduct(null); await loadProducts(); }
            }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Name</span><span className="font-medium">{selectedProduct?.name}</span></div>
            <div className="flex justify-between"><span>SKU</span><span className="font-medium">{selectedProduct?.sku}</span></div>
            <div className="flex justify-between"><span>Category</span><span className="font-medium">{selectedProduct?.category}</span></div>
            <div className="flex justify-between"><span>Price</span><span className="font-medium">{formatCurrency(Number(selectedProduct?.price || 0))}</span></div>
            <div className="flex justify-between"><span>Stock</span><span className="font-medium">{Number(selectedProduct?.stock || 0)}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-medium">{selectedProduct?.status}</span></div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm font-medium">{selectedProduct?.name}</p>
            <div className="text-xs text-muted-foreground">Current: {Number(selectedProduct?.stock ?? 0)}</div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={adjustMode === "add" ? "default" : "outline"} onClick={() => setAdjustMode("add")}>Add</Button>
              <Button variant={adjustMode === "set" ? "default" : "outline"} onClick={() => setAdjustMode("set")}>Set</Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => { const n = Math.max(0, (parseInt(adjustQty || "0", 10) || 0) - 1); setAdjustQty(String(n)); }}>-</Button>
              <Input type="number" min={0} value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} />
              <Button variant="outline" size="icon" onClick={() => { const n = (parseInt(adjustQty || "0", 10) || 0) + 1; setAdjustQty(String(n)); }}>+</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdjustOpen(false)}>Cancel</Button>
            <Button onClick={async () => {
              if (!selectedProduct?.id) return;
              const base = Number(selectedProduct.stock ?? 0);
              const qty = Math.max(0, Math.floor(Number(adjustQty || 0)));
              if (qty < 0) { setIsAdjustOpen(false); return; }
              const targetEventId = currentEventId || (selectedProduct.eventId ?? null);
              if (targetEventId) {
                const baseEvent = selectedProduct.stockByEvent?.[targetEventId] !== undefined
                  ? Number(selectedProduct.stockByEvent?.[targetEventId] || 0)
                  : (selectedProduct.eventId === targetEventId ? Number(selectedProduct.stock || 0) : 0);
                if (adjustMode === "add") {
                  await productService.updateEventStock(selectedProduct.id, targetEventId, qty);
                } else {
                  const delta = qty - baseEvent;
                  if (delta === 0) { setIsAdjustOpen(false); setSelectedProduct(null); return; }
                  await productService.updateEventStock(selectedProduct.id, targetEventId, delta);
                }
              } else {
                if (adjustMode === "add") {
                  const next = base + qty;
                  await productService.updateStock(selectedProduct.id, next);
                } else {
                  await productService.updateStock(selectedProduct.id, qty);
                }
              }
              setIsAdjustOpen(false);
              setSelectedProduct(null);
              await loadProducts();
            }}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
