import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ShoppingCart, Package, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { productService, Product } from "@/services/productService";
import { transactionService } from "@/services/transactionService";
import { useEventContext } from "@/context/EventContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/authService";
import codesLogo from "@/assets/codes-logo.png";
import { database, supabase } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  sku?: string;
  imageUrl?: string;
}

type YearLevel = "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
interface ReceiptTxnItem { name: string; quantity: number; price: number }
interface ReceiptTxn {
  id?: string;
  items: ReceiptTxnItem[];
  subtotal: number;
  total: number;
  eventName: string;
  createdAt: string;
  paymentMethod: string;
  cashier: string;
  customerName?: string;
  yearLevel?: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
}

const CartContent = ({
  cartItems,
  subtotal,
  total,
  paymentMethod,
  setPaymentMethod,
  customerName,
  setCustomerName,
  yearLevel,
  setYearLevel,
  updateQuantity,
  removeFromCart,
  checkout,
  isCheckingOut,
}: {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  customerName: string;
  setCustomerName: (v: string) => void;
  yearLevel: YearLevel | undefined;
  setYearLevel: (v: YearLevel | undefined) => void;
  updateQuantity: (id: string, change: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => Promise<void> | void;
  isCheckingOut: boolean;
}) => (
  <>
    <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <ShoppingCart size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Select products to start a sale</p>
        </div>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg min-h-[56px]">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-background rounded overflow-hidden flex items-center justify-center flex-shrink-0">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">₱{item.price} each</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full flex-shrink-0"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </Button>
                <div className="h-8 w-8 flex items-center justify-center font-medium text-sm flex-shrink-0">{item.quantity}</div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0 rounded-full flex-shrink-0"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </Button>
              </div>
              <p className="font-bold text-sm">₱{item.price * item.quantity}</p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={() => removeFromCart(item.id)}
            >
              <X size={14} />
            </Button>
          </div>
        ))
      )}
    </div>

    <div className="space-y-4 pt-6 border-t bg-background rounded-lg p-3 md:p-4 flex-shrink-0">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Items ({cartItems.length})</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between text-base md:text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₱{total.toFixed(2)}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-muted-foreground">Payment</span>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="mt-1 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Student Name</span>
            <Input className="mt-1 h-8" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter name" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Year Level</span>
            <Select value={yearLevel ?? undefined} onValueChange={(v: YearLevel) => setYearLevel(v)}>
              <SelectTrigger className="mt-1 h-8">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
                <SelectItem value="4th Year">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground flex items-end justify-end">
            <span>Cashier: {authService.getCurrentUser()?.fullName || ""}</span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full h-12"
        disabled={cartItems.length === 0 || isCheckingOut}
        onClick={checkout}
        aria-busy={isCheckingOut}
      >
        {isCheckingOut ? "Processing..." : (
          <>Checkout <span className="ml-2">→</span></>
        )}
      </Button>
    </div>
  </>
);

const POS = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentEventId, currentEventName, events } = useEventContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTxn, setLastTxn] = useState<ReceiptTxn | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  
  const [customerName, setCustomerName] = useState<string>("");
  const [yearLevel, setYearLevel] = useState<YearLevel | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [addLock, setAddLock] = useState<Record<string, boolean>>({});
  const categoryOptions = ["All", "T-Shirt", "Shirts", "Lanyards", "Keychains", "Others"];

  useEffect(() => {
    const r = ref(database, "products");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, Product>) : {};
      const list: Product[] = Object.entries(obj).map(([id, p]) => {
        const raw = p as unknown as Record<string, unknown>;
        const imagePath = typeof raw.imagePath === "string" ? (raw.imagePath as string) : undefined;
        const resolved = imagePath ? supabase?.storage.from("product_images").getPublicUrl(imagePath).data.publicUrl : undefined;
        const fallback = typeof raw.imageUrl === "string" && raw.imageUrl
          ? (raw.imageUrl as string)
          : typeof raw.imageURL === "string" && raw.imageURL
          ? (raw.imageURL as string)
          : typeof raw.image_url === "string" && raw.image_url
          ? (raw.image_url as string)
          : undefined;
        return { ...(p as Product), id, imageUrl: resolved || fallback } as Product;
      });
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const displayedProducts = useMemo(() => {
    const norm = (v: string | null | undefined) => String(v || "").trim().toLowerCase();
    const candId = norm(currentEventId);
    let list = [...products];
    if (currentEventId) {
      const idMatches = (p: Product) => {
        if ((p.eventId ?? null) && norm(p.eventId as string) === candId) return true;
        const keys = Object.keys(p.stockByEvent || {});
        return keys.some((k) => norm(k) === candId);
      };
      list = list.filter(idMatches);
    }
    if (selectedCategory !== "All") {
      const cat = selectedCategory.toLowerCase();
      list = list.filter((p) => String(p.category || "").toLowerCase().includes(cat));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || String(p.category || "").toLowerCase().includes(q));
    }
    if (currentEventId) {
      return list.map((p) => {
        const keys = Object.keys(p.stockByEvent || {});
        const matchKey = keys.find((k) => norm(k) === candId);
        if (matchKey) {
          return { ...p, stock: Number(p.stockByEvent?.[matchKey] ?? 0) } as Product;
        }
        if ((p.eventId ?? null) && norm(p.eventId as string) === candId) {
          return { ...p, stock: Number(p.stock ?? 0) } as Product;
        }
        return { ...p, stock: 0 } as Product;
      });
    }
    return list;
  }, [products, currentEventId, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const pid = String(product.id || "");
    if (addLock[pid]) return;
    setAddLock((m) => ({ ...m, [pid]: true }));
    setTimeout(() => {
      setAddLock((m) => ({ ...m, [pid]: false }));
    }, 300);
    const raw = product as unknown as Record<string, unknown>;
    const img =
      (typeof raw.imageUrl === "string" && (raw.imageUrl as string)) ||
      (typeof raw.imageURL === "string" && (raw.imageURL as string)) ||
      (typeof raw.image_url === "string" && (raw.image_url as string)) ||
      product.imageUrl;
    setCartItems([
      {
        id: pid,
        name: product.name,
        price: product.price,
        stock: Number(product.stock ?? 0),
        quantity: 1,
        sku: product.sku,
        imageUrl: img,
      },
    ]);
  };

  const selectProduct = (product: Product) => {
    const pid = String(product.id || "");
    const raw = product as unknown as Record<string, unknown>;
    const img =
      (typeof raw.imageUrl === "string" && (raw.imageUrl as string)) ||
      (typeof raw.imageURL === "string" && (raw.imageURL as string)) ||
      (typeof raw.image_url === "string" && (raw.image_url as string)) ||
      product.imageUrl;
    setCartItems([
      {
        id: pid,
        name: product.name,
        price: product.price,
        stock: Number(product.stock ?? 0),
        quantity: 1,
        sku: product.sku,
        imageUrl: img,
      },
    ]);
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async () => {
    if (cartItems.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);
    const items = cartItems.map((it) => ({
      productId: String(it.id),
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      sku: it.sku,
    }));
    const user = authService.getCurrentUser();
    const eventCandidates = new Set<string>();
    if (!currentEventId) {
      items.forEach((it) => {
        const p = products.find((pp) => String(pp.id || "") === String(it.productId || ""));
        if (!p) return;
        if (p.eventId) eventCandidates.add(String(p.eventId));
        else {
          const sb = p.stockByEvent || {};
          Object.keys(sb || {}).forEach((k) => {
            const val = Number(sb[k] || 0);
            if (val > 0) eventCandidates.add(String(k));
          });
        }
      });
    }
    const inferredEventId = currentEventId || (eventCandidates.size === 1 ? Array.from(eventCandidates)[0] : null);
    const inferredEventName = inferredEventId ? (events.find((e) => e.id === inferredEventId)?.name || currentEventName) : currentEventName;
    const res = await transactionService.create({
      eventId: inferredEventId ?? null,
      items,
      subtotal,
      total,
      paymentMethod,
      cashier: user?.fullName || "",
      customerName: customerName || "",
      yearLevel: yearLevel,
    });
    if (res.success) {
      setLastTxn({ id: res.id, items, subtotal, total, eventName: inferredEventName, createdAt: new Date().toLocaleString(), paymentMethod, cashier: user?.fullName || "", customerName: customerName || "", yearLevel: yearLevel });
      setIsReceiptOpen(true);
      setCartItems([]);
      setIsCartOpen(false);
      
      setCustomerName("");
      setYearLevel(undefined);
    }
    setIsCheckingOut(false);
  };

  

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <Button variant="outline" size="icon" className="flex-shrink-0" disabled={isCheckingOut}>
              <Filter size={18} />
            </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className="whitespace-nowrap text-xs md:text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pb-20 md:pb-0">
          {displayedProducts.map((product) => (
            <Card
              key={product.id}
              className="p-3 md:p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => selectProduct(product)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-2 md:mb-3 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={32} className="text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold mb-1 text-xs md:text-sm truncate">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-lg font-bold text-primary">₱{product.price}</span>
                <Badge variant={product.stock > 20 ? "default" : product.stock > 5 ? "secondary" : "destructive"} className="text-[10px] md:text-xs">{product.stock}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Cart Floating Button & Sheet */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="w-full shadow-xl relative">
              <ShoppingCart size={20} className="mr-2" />
              View Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
              <span className="ml-auto font-bold">₱{total.toFixed(2)}</span>
              <ChevronUp size={20} className="ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] flex flex-col">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Current Sale
                <Badge>{currentEventName}</Badge>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col overflow-hidden mt-4">
            <CartContent
              cartItems={cartItems}
              subtotal={subtotal}
              total={total}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                customerName={customerName}
                setCustomerName={setCustomerName}
                yearLevel={yearLevel}
                setYearLevel={setYearLevel}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                checkout={checkout}
                isCheckingOut={isCheckingOut}
            />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Cart Sidebar */}
      <Card className="hidden md:flex w-[350px] lg:w-[400px] p-4 lg:p-6 flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold">Current Sale</h2>
          <Badge>{currentEventName}</Badge>
        </div>
        <CartContent
          cartItems={cartItems}
          subtotal={subtotal}
          total={total}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          customerName={customerName}
          setCustomerName={setCustomerName}
          yearLevel={yearLevel}
          setYearLevel={setYearLevel}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          checkout={checkout}
          isCheckingOut={isCheckingOut}
        />
      </Card>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {lastTxn ? (
            <div className="print-area space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b">
                <img src={codesLogo} alt="CoDeS" className="w-10 h-10" />
                <div>
                  <p className="font-bold text-sm">CoDeSMerch</p>
                  <p className="text-xs text-muted-foreground">UM Tagum College</p>
                </div>
              </div>
                <div className="text-sm">
                  <div className="flex justify-between"><span>Event</span><span>{lastTxn.eventName}</span></div>
                  <div className="flex justify-between"><span>Transaction</span><span>{lastTxn.id || "(unsynced)"}</span></div>
                  <div className="flex justify-between"><span>Date</span><span>{lastTxn.createdAt}</span></div>
                  <div className="flex justify-between"><span>Payment</span><span>{String(lastTxn.paymentMethod).toUpperCase()}</span></div>
                  <div className="flex justify-between"><span>Cashier</span><span>{lastTxn.cashier || ""}</span></div>
                  <div className="flex justify-between"><span>Student</span><span>{lastTxn.customerName || "-"}</span></div>
                  <div className="flex justify-between"><span>Year Level</span><span>{lastTxn.yearLevel || "-"}</span></div>
                </div>
              <div className="border-t pt-2 space-y-1">
                {lastTxn.items.map((it: { name: string; quantity: number; price: number }, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="truncate">{it.name} × {it.quantity}</span>
                    <span>₱{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₱{lastTxn.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>₱{lastTxn.total.toFixed(2)}</span></div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>Close</Button>
            <Button onClick={() => window.print()}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
