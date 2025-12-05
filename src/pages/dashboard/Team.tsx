import { Users, Plus, Mail, Phone, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Team = () => {
  const teamMembers = [
    {
      name: "Juan Dela Cruz",
      email: "juan.delacruz@umtc.edu.ph",
      phone: "+63 912 345 6789",
      role: "President",
      systemRole: "Super Admin",
      status: "Active",
      lastActive: "2 hours ago",
      stats: { transactions: 45, events: 3 },
    },
    {
      name: "Maria Santos",
      email: "maria.santos@umtc.edu.ph",
      phone: "+63 923 456 7890",
      role: "Business Manager",
      systemRole: "Admin",
      status: "Active",
      lastActive: "5 minutes ago",
      stats: { transactions: 89, events: 5 },
    },
    {
      name: "Pedro Reyes",
      email: "pedro.reyes@umtc.edu.ph",
      phone: "+63 934 567 8901",
      role: "Cashier",
      systemRole: "Cashier",
      status: "Active",
      lastActive: "Online now",
      stats: { transactions: 156, events: 2 },
    },
    {
      name: "Ana Garcia",
      email: "ana.garcia@umtc.edu.ph",
      phone: "+63 945 678 9012",
      role: "Inventory Officer",
      systemRole: "Manager",
      status: "Active",
      lastActive: "1 day ago",
      stats: { transactions: 0, events: 4 },
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin": return "destructive";
      case "Admin": return "default";
      case "Manager": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Team Management</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage CoDeS officers and their access</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          Invite User
        </Button>
      </div>

      {/* Stat Cards - 2x2 grid on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <Card className="p-3 md:p-6">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 md:mb-4">
            <Users className="text-primary" size={18} />
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">{teamMembers.length}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Team Members</p>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-success/10 flex items-center justify-center mb-2 md:mb-4">
            <Shield className="text-success" size={18} />
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">2</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Administrators</p>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-2 md:mb-4">
            <Users className="text-secondary" size={18} />
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">3</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Active Now</p>
        </Card>

        <Card className="p-3 md:p-6">
          <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-2 md:mb-4">
            <Mail className="text-warning" size={18} />
          </div>
          <h3 className="text-lg md:text-2xl font-bold mb-0.5 md:mb-1">1</h3>
          <p className="text-xs md:text-sm text-muted-foreground">Pending Invites</p>
        </Card>
      </div>

      {/* Team Member Cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {teamMembers.map((member, index) => (
          <Card key={index} className="p-4 md:p-6">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-primary to-secondary text-white">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">{member.name}</h3>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge variant={getRoleColor(member.systemRole)} className="text-[10px]">
                      {member.systemRole}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">{member.status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5 mb-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={12} />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone size={12} />
                  <span>{member.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Last Active</p>
                    <p className="font-medium">{member.lastActive}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trans.</p>
                    <p className="font-bold">{member.stats.transactions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Events</p>
                    <p className="font-bold">{member.stats.events}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-start gap-6">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-secondary text-white">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getRoleColor(member.systemRole)}>
                      {member.systemRole}
                    </Badge>
                    <Badge variant="outline">{member.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-muted-foreground" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Last Active</p>
                      <p className="font-medium">{member.lastActive}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="font-bold">{member.stats.transactions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Events</p>
                      <p className="font-bold">{member.stats.events}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Activity Log</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;