import { useEffect, useMemo, useState } from "react";
import { Users, Check, X, Clock, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { database, auth } from "@/config/firebase";
import { onValue, ref } from "firebase/database";
import { authService } from "@/services/authService";
import { toast } from "sonner";

type MemberStatus = "approved" | "pending";
type Role = string;

interface TeamMember {
  uid: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  requestedRole?: string;
}

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const r = ref(database, "users");
    const unsub = onValue(r, (snap) => {
      const list: TeamMember[] = [];
      snap.forEach((c) => {
        const v = c.val() as any;
        const statusRaw = String(v.status || "").toLowerCase();
        const isPending = statusRaw === "pending";
        list.push({
          uid: c.key!,
          name: String(v.fullName || v.name || ""),
          email: String(v.email || ""),
          role: String(v.role || "member"),
          status: isPending ? "pending" : "approved",
          requestedRole: String(v.requestedRole || ""),
        });
      });
      setMembers(list);
    });
    return () => unsub();
  }, []);

  const pendingMembers = useMemo(() => members.filter(m => m.status === "pending"), [members]);
  const approvedMembers = useMemo(() => members.filter(m => m.status === "approved"), [members]);

  const handleApprove = async (uid: string, grantedRole?: string) => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error("Missing token");
      const res = await fetch(`${API_URL}/auth/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid, grantedRole }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Approve failed");
      }
      toast.success("Approval granted");
    } catch (e: any) {
      toast.error(e.message || "Approve failed");
    }
  };

  const handleReject = async (uid: string) => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (!token) throw new Error("Missing token");
      const res = await fetch(`${API_URL}/auth/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ uid }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Reject failed");
      }
      toast.success("Rejected and set to member");
    } catch (e: any) {
      toast.error(e.message || "Reject failed");
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case "Vice President": return "default";
      case "Secretary": return "secondary";
      case "Treasurer": return "secondary";
      default: return "outline";
    }
  };

  const current = authService.getCurrentUser();
  const canSee = String(current?.systemRole || "").toLowerCase() === "super_admin";

  if (!canSee) {
    return (
      <Card className="p-8 text-center">
        <ShieldAlert className="mx-auto mb-3 text-muted-foreground" size={32} />
        <p className="text-muted-foreground">Team dashboard is available to the President only</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Team</h1>
        <p className="text-sm text-muted-foreground">Manage CoDeS officers and approvals</p>
      </div>

      {/* Pending Approvals Section */}
      {pendingMembers.length > 0 && (
        <Card className="p-4 md:p-6 border-warning/30 bg-warning/5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-warning" />
            <h2 className="font-semibold">Pending Approvals ({pendingMembers.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingMembers.map((member) => (
              <div 
                key={member.uid} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-background/50 border"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{member.requestedRole || member.role}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 ml-auto sm:ml-0">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 gap-1.5 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleReject(member.uid)}
                  >
                    <X size={14} />
                    Reject
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 gap-1.5"
                    onClick={() => handleApprove(member.uid, member.requestedRole)}
                  >
                    <Check size={14} />
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Team Members List */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-primary" />
          <h2 className="font-semibold">Team Members ({approvedMembers.length})</h2>
        </div>
        
        <div className="grid gap-3">
          {approvedMembers.map((member) => (
            <Card key={member.uid} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarFallback className="text-xs md:text-sm font-bold bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    {member.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
                <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs shrink-0">
                  {member.role}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {approvedMembers.length === 0 && (
          <Card className="p-8 text-center">
            <Users className="mx-auto mb-3 text-muted-foreground" size={32} />
            <p className="text-muted-foreground">No team members yet</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Team;
