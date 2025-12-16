import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { database } from "@/config/firebase";
import { get, ref, set } from "firebase/database";
import { useTheme } from "next-themes";

const Settings = () => {
  const { setTheme } = useTheme();
  const defaults = { darkMode: true, animations: true, currency: "PHP", timezone: "Asia/Manila" };
  const [general, setGeneral] = useState(() => {
    try {
      const ls = localStorage.getItem("settings.general");
      if (ls) {
        const parsed = JSON.parse(ls);
        return { ...defaults, ...parsed } as typeof defaults;
      }
    } catch { void 0; }
    return defaults;
  });
  

  useEffect(() => {
    (async () => {
      try {
        const snap = await get(ref(database, "settings"));
        if (snap.exists()) {
          const s = snap.val() as { general?: Partial<typeof defaults> };
          if (s.general) setGeneral((prev) => ({ ...prev, ...s.general }));
        }
      } catch (e) {
        try {
          const ls = localStorage.getItem("settings.general");
          if (ls) {
            const parsed = JSON.parse(ls);
            setGeneral((prev) => ({ ...prev, ...parsed }));
          }
        } catch { void 0; }
      }
    })();
  }, []);

  useEffect(() => {
    try { localStorage.setItem("settings.general", JSON.stringify(general)); } catch { void 0; }
    try { setTheme(general.darkMode ? "dark" : "light"); } catch { void 0; }
  }, [general, setTheme]);

  const saveGeneral = async () => {
    try {
      await set(ref(database, "settings/general"), general);
      try { localStorage.setItem("settings.general", JSON.stringify(general)); } catch { void 0; }
      try { setTheme(general.darkMode ? "dark" : "light"); } catch { void 0; }
      toast.success("General settings saved");
    } catch { toast.error("Failed to save general settings"); }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your system preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
        {/* Scrollable tabs on mobile */}
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max md:w-full md:grid md:grid-cols-1 h-auto p-1">
            <TabsTrigger value="general" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">General</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="md:hidden" />
        </ScrollArea>

        <TabsContent value="general" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">General Settings</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="dark-mode" className="font-medium text-sm md:text-base">Dark Mode</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Enable dark theme</p>
                </div>
                <Switch id="dark-mode" checked={general.darkMode} onCheckedChange={(v) => setGeneral({ ...general, darkMode: v })} />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="animations" className="font-medium text-sm md:text-base">Enable Animations</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Show smooth transitions</p>
                </div>
                <Switch id="animations" checked={general.animations} onCheckedChange={(v) => setGeneral({ ...general, animations: v })} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm md:text-base">Currency Format</Label>
                <Select value={general.currency} onValueChange={(v) => setGeneral({ ...general, currency: v })}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHP">PHP (₱)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm md:text-base">Timezone</Label>
                <Select value={general.timezone} onValueChange={(v) => setGeneral({ ...general, timezone: v })}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Manila">Asia/Manila</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                    <SelectItem value="Europe/London">Europe/London</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
              </div>
            </div>
          </Card>
        </TabsContent>

        

      </Tabs>
    </div>
  );
};

export default Settings;
