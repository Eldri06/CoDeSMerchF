import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEventContext } from "@/context/EventContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage, database } from "@/config/firebase";
import { createClient } from "@supabase/supabase-js";
import { ref as dbRef, update, get, onValue } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const DashboardHeader = () => {
  const { currentEventName, currentEventId, events, setEvent, refreshEvents } = useEventContext();
  type LowStockItem = { id: string; name?: string; sku?: string; stock?: number; reorderLevel?: number };
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const API_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
  const navigate = useNavigate();

  const fetchLowStock = async () => {
    try {
      setNotifLoading(true);
      const snap = await get(dbRef(database, "products"));
      if (snap.exists()) {
        const obj = snap.val() as Record<string, { stock?: number; reorderLevel?: number; name?: string; sku?: string }>;
        const list: LowStockItem[] = Object.entries(obj)
          .map(([id, p]) => ({ id, name: p.name, sku: p.sku, stock: p.stock, reorderLevel: p.reorderLevel }))
          .filter((p) => (p.stock ?? 0) <= (p.reorderLevel ?? 10));
        setLowStock(list);
      } else {
        setLowStock([]);
      }
    } catch {
      setLowStock([]);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
    const id = setInterval(fetchLowStock, 30000);
    return () => clearInterval(id);
  }, []);

  const initialUser = authService.getCurrentUser();
  const [user, setUser] = useState(initialUser);
  const [profileOpen, setProfileOpen] = useState(false);
  const [fullName, setFullName] = useState<string>(user?.fullName || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const titleByRole = (() => {
    const roleLc = String(user?.systemRole || "").toLowerCase();
    if (roleLc === "super_admin") return "Super Admin's Profile";
    if (["vice_president", "officer", "secretary", "treasurer", "pio"].includes(roleLc)) return "Admin User Profile";
    return "Member/Visitors User Profile";
  })();

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setAvatarFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(String(reader.result || ""));
      reader.readAsDataURL(f);
    } else {
      setAvatarPreview("");
    }
  };

  useEffect(() => {
    const uid = user?.uid;
    if (!uid) return;
    const r = dbRef(database, `users/${uid}`);
    const unsub = onValue(r, (snap) => {
      const v = snap.val() as Partial<typeof user> | null;
      if (!v) return;
      const merged = { ...user!, ...v };
      localStorage.setItem("user", JSON.stringify(merged));
      setUser(merged);
    });
    return () => unsub();
  }, [user?.uid]);

  const saveProfile = async () => {
    if (!user?.uid) return;
    try {
      setSaving(true);
      let avatarUrl: string | undefined;
      if (avatarFile) {
        try { void 0 }
        catch { void 0 }
        try {
          const ext = (avatarFile.type || 'image/jpeg').includes('png') ? 'png' : (avatarFile.type || '').includes('webp') ? 'webp' : 'jpg';
          const path = `profiles/${user.uid}.${ext}`;
          const fd = new FormData();
          fd.append('bucket', 'profile-images');
          fd.append('path', path);
          fd.append('file', avatarFile, avatarFile.name);
          {
            const lsUrl = localStorage.getItem('SUPABASE_URL') || localStorage.getItem('VITE_SUPABASE_URL') || import.meta.env.VITE_SUPABASE_URL || '';
            const lsKey = localStorage.getItem('SUPABASE_ANON_KEY') || localStorage.getItem('VITE_SUPABASE_ANON_KEY') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
            if (lsUrl && lsKey) {
              const rt = createClient(lsUrl, lsKey);
              const up2 = await rt.storage.from('profile-images').upload(path, avatarFile, { contentType: avatarFile.type || 'image/jpeg', upsert: true });
              if (!up2.error) {
                const pub = rt.storage.from('profile-images').getPublicUrl(path).data.publicUrl;
                avatarUrl = pub || '';
              }
            }
          }
          if (!avatarUrl) {
            try {
              const up = await fetch(`${API_URL}/storage/upload`, { method: 'POST', body: fd });
              const j = await up.json().catch(() => ({ success: false }));
              if (j.success && j.url) {
                avatarUrl = String(j.url);
              }
            } catch { void 0 }
          }
        } catch { void 0 }
        if (!avatarUrl && avatarPreview) {
          avatarUrl = avatarPreview;
        }
      }
      const updates: { fullName?: string; phone?: string; avatarUrl?: string } = { fullName, phone };
      if (avatarUrl) updates.avatarUrl = avatarUrl;
      await update(dbRef(database, `users/${user.uid}`), updates);
      const newLocal = { ...user!, fullName, phone, ...(avatarUrl ? { avatarUrl } : {}) };
      localStorage.setItem("user", JSON.stringify(newLocal));
      setUser(newLocal);
      toast.success("Profile updated");
      setProfileOpen(false);
    } catch (e) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const r = dbRef(database, 'products');
    const unsub = onValue(r, (snap) => {
      try {
        if (!snap.exists()) { setLowStock([]); return; }
        const obj = snap.val() as Record<string, { stock?: number; reorderLevel?: number; name?: string; sku?: string }>;
        const list: LowStockItem[] = Object.entries(obj)
          .map(([id, p]) => ({ id, name: p.name, sku: p.sku, stock: p.stock, reorderLevel: p.reorderLevel }))
          .filter((p) => (p.stock ?? 0) <= (p.reorderLevel ?? 10));
        setLowStock(list);
      } catch {
        setLowStock([]);
      }
    });
    return () => unsub();
  }, []);
  return (
    <header className="h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-3 md:px-6 z-10">
      <div />

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* Event Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2 border-border/50 hover:border-primary h-9 px-2">
              <span className="text-sm font-medium">{currentEventName}</span>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Event</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setEvent(null)}>
              All Events
            </DropdownMenuItem>
            {events.map((e) => (
              <DropdownMenuItem key={e.id} onClick={() => setEvent(e.id!)}>
                {e.name} {currentEventId === e.id ? "✓" : ""}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={refreshEvents}>Refresh</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button onClick={fetchLowStock} variant="ghost" size="icon" className="relative h-9 w-9" title="Notifications">
              <Bell size={18} />
              {lowStock.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifLoading && <DropdownMenuItem>Loading...</DropdownMenuItem>}
            {!notifLoading && lowStock.length === 0 && (
              <DropdownMenuItem>No low stock alerts</DropdownMenuItem>
            )}
            {!notifLoading && lowStock.slice(0, 6).map((p) => (
              <DropdownMenuItem key={p.id}>
                {(p.name || 'Item')} · SKU {(p.sku || '-')}
                <span className="ml-auto text-xs">Stock {(p.stock ?? 0)}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={fetchLowStock}>Refresh</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-1 md:gap-2 pl-1 md:pl-2 h-9">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  (user?.fullName || user?.email || "").split(" ").map(s => s[0]).join("") || "CO"
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">{user?.fullName || "CoDeS Officer"}</p>
                <p className="text-xs text-muted-foreground">
                  {(() => {
                    const r = String(user?.systemRole || "").toLowerCase();
                    if (r === "super_admin") return "Super Admin";
                    if (["vice_president","officer","secretary","treasurer","pio"].includes(r)) return "Admin";
                    return "Member";
                  })()}
                </p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>Account</DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              await authService.logout();
              toast.success("Logged out");
              navigate("/login");
            }}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{titleByRole}</DialogTitle>
              <DialogDescription>Edit your profile details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold">
                      {(fullName || user?.email || "").split(" ").map(s => s[0]).join("") || "CO"}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <Input id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProfileOpen(false)} disabled={saving}>Cancel</Button>
              <Button onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default DashboardHeader;
