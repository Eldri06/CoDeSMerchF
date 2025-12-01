import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your system preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">General Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable dark theme</p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations" className="font-medium">Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">Show smooth transitions and effects</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency Format</Label>
                <Input id="currency" defaultValue="PHP (₱)" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="Asia/Manila" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Organization Information</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input id="org-name" defaultValue="Computer Debuggers Society" disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-name">Short Name</Label>
                <Input id="short-name" defaultValue="CoDeS" disabled />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" defaultValue="codes@umtc.edu.ph" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Page</Label>
                <Input id="facebook" placeholder="facebook.com/codesumtc" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" placeholder="@codesumtc" />
              </div>

              <Button>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch id="email-notif" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="low-stock" className="font-medium">Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when stock is low</p>
                </div>
                <Switch id="low-stock" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-summary" className="font-medium">Daily Sales Summary</Label>
                  <p className="text-sm text-muted-foreground">Daily report at 8:00 AM</p>
                </div>
                <Switch id="daily-summary" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="event-reminders" className="font-medium">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Reminders 1 day before events</p>
                </div>
                <Switch id="event-reminders" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button>Update Password</Button>

              <div className="pt-6 border-t space-y-4">
                <h3 className="font-bold">Session Management</h3>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Backup & Data</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="font-medium">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Daily backups at 2:00 AM</p>
                </div>
                <Switch id="auto-backup" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Last Backup</Label>
                <p className="text-sm">Jan 20, 2025 at 2:00 AM • 245 MB</p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline">Download Backup</Button>
                <Button>Create Backup Now</Button>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-bold mb-4">Export Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export all your data in various formats
                </p>
                <div className="flex gap-4">
                  <Button variant="outline">Export as JSON</Button>
                  <Button variant="outline">Export as CSV</Button>
                  <Button variant="outline">Export as Excel</Button>
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