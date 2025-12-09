import { database } from "@/config/firebase";
import { ref, get, push, set, update, remove } from "firebase/database";

export interface EventItem {
  id?: string;
  name: string;
  status: "Planning" | "Upcoming" | "Live" | "Completed";
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

export const eventService = {
  async getAllEvents(): Promise<EventItem[]> {
    try {
      const snapshot = await get(ref(database, "events"));
      if (!snapshot.exists()) return [];
      const obj = snapshot.val() as Record<string, EventItem>;
      return Object.entries(obj).map(([id, e]) => ({ ...e, id }));
    } catch (e) {
      console.error("Get all events error", e);
      return [];
    }
  },

  async getMostRecentActiveEvent(): Promise<EventItem | null> {
    try {
      const all = await this.getAllEvents();
      const active = all.filter((e) => e.status === "Live" || e.status === "Upcoming");
      if (active.length === 0) return null;
      const sorted = active.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      return sorted[0] ?? null;
    } catch (e) {
      console.error("Get most recent active event error", e);
      return null;
    }
  },

  async createEvent(data: Omit<EventItem, "id" | "createdAt">): Promise<{ success: boolean; id?: string }>{
    try {
      const now = new Date().toISOString();
      const newRef = push(ref(database, "events"));
      await set(newRef, { ...data, createdAt: now });
      return { success: true, id: newRef.key ?? undefined };
    } catch (e) {
      console.error("Create event error", e);
      return { success: false };
    }
  },
  async updateEvent(id: string, updates: Partial<EventItem>): Promise<{ success: boolean }>{
    try {
      await update(ref(database, `events/${id}`), { ...updates });
      return { success: true };
    } catch (e) {
      console.error("Update event error", e);
      return { success: false };
    }
  },
  async deleteEvent(id: string): Promise<{ success: boolean }>{
    try {
      await remove(ref(database, `events/${id}`));
      return { success: true };
    } catch (e) {
      console.error("Delete event error", e);
      return { success: false };
    }
  },
};
