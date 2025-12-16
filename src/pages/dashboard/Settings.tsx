import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your system preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
        {/* Scrollable tabs on mobile */}
        <ScrollArea className="w-full">
          <TabsList className="inline-flex w-max md:w-full md:grid md:grid-cols-6 h-auto p-1">
            <TabsTrigger value="general" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">General</TabsTrigger>
            <TabsTrigger value="organization" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">Organization</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">Security</TabsTrigger>
            <TabsTrigger value="backup" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">Backup</TabsTrigger>
            <TabsTrigger value="storage" className="text-xs md:text-sm whitespace-nowrap px-3 py-2">Storage</TabsTrigger>
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
                <Switch id="dark-mode" defaultChecked />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="animations" className="font-medium text-sm md:text-base">Enable Animations</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Show smooth transitions</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm md:text-base">Currency Format</Label>
                <Input id="currency" defaultValue="PHP (₱)" className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm md:text-base">Timezone</Label>
                <Input id="timezone" defaultValue="Asia/Manila" className="text-sm" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Organization Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name" className="text-sm md:text-base">Organization Name</Label>
                <Input id="org-name" defaultValue="Computer Debuggers Society" disabled className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-name" className="text-sm md:text-base">Short Name</Label>
                <Input id="short-name" defaultValue="CoDeS" disabled className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm md:text-base">Contact Email</Label>
                <Input id="contact-email" defaultValue="codes@umtc.edu.ph" className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm md:text-base">Facebook Page</Label>
                <Input id="facebook" placeholder="facebook.com/codesumtc" className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm md:text-base">Instagram</Label>
                <Input id="instagram" placeholder="@codesumtc" className="text-sm" />
              </div>

              <Button className="w-full md:w-auto">Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Notification Preferences</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="email-notif" className="font-medium text-sm md:text-base">Email Notifications</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="low-stock" className="font-medium text-sm md:text-base">Low Stock Alerts</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Get notified when stock is low</p>
                </div>
                <Switch id="low-stock" defaultChecked />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="daily-summary" className="font-medium text-sm md:text-base">Daily Sales Summary</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Daily report at 8:00 AM</p>
                </div>
                <Switch id="daily-summary" defaultChecked />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="event-reminders" className="font-medium text-sm md:text-base">Event Reminders</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Reminders 1 day before events</p>
                </div>
                <Switch id="event-reminders" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Security Settings</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm md:text-base">Current Password</Label>
                <Input id="current-password" type="password" className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm md:text-base">New Password</Label>
                <Input id="new-password" type="password" className="text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm md:text-base">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="text-sm" />
              </div>

              <Button className="w-full md:w-auto">Update Password</Button>

              <div className="pt-4 md:pt-6 border-t space-y-4">
                <h3 className="font-bold text-sm md:text-base">Session Management</h3>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout" className="text-sm md:text-base">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" className="text-sm" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Backup & Data</h2>
            
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="auto-backup" className="font-medium text-sm md:text-base">Automatic Backups</Label>
                  <p className="text-xs md:text-sm text-muted-foreground">Daily backups at 2:00 AM</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm md:text-base">Last Backup</Label>
                <p className="text-xs md:text-sm">Jan 20, 2025 at 2:00 AM • 245 MB</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                <Button variant="outline" className="flex-1 sm:flex-none text-sm">Download Backup</Button>
                <Button className="flex-1 sm:flex-none text-sm">Create Backup Now</Button>
              </div>

              <div className="pt-4 md:pt-6 border-t">
                <h3 className="font-bold mb-3 md:mb-4 text-sm md:text-base">Export Data</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                  Export all your data in various formats
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4">
                  <Button variant="outline" className="text-sm">Export JSON</Button>
                  <Button variant="outline" className="text-sm">Export CSV</Button>
                  <Button variant="outline" className="text-sm">Export Excel</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Settings;
