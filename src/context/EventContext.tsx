import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { eventService, EventItem } from "@/services/eventService";

interface EventState {
  currentEventId: string | null;
  currentEventName: string;
  events: EventItem[];
  setEvent: (eventId: string | null) => void;
  refreshEvents: () => Promise<void>;
}

const EventContext = createContext<EventState | undefined>(undefined);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);

  const currentEventName = useMemo(() => {
    if (!currentEventId) return "All Events";
    const found = events.find((e) => e.id === currentEventId);
    return found?.name ?? "All Events";
  }, [events, currentEventId]);

  const refreshEvents = async () => {
    const list = await eventService.getAllEvents();
    setEvents(list);
  };

  const setEvent = (eventId: string | null) => {
    setCurrentEventId(eventId);
    localStorage.setItem("selectedEventId", eventId ?? "");
  };

  useEffect(() => {
    (async () => {
      await refreshEvents();
      const saved = localStorage.getItem("selectedEventId") || "";
      if (saved) {
        setCurrentEventId(saved);
        return;
      }
      const mostRecent = await eventService.getMostRecentActiveEvent();
      setCurrentEventId(mostRecent?.id ?? null);
    })();
  }, []);

  return (
    <EventContext.Provider
      value={{ currentEventId, currentEventName, events, setEvent, refreshEvents }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEventContext must be used within EventProvider");
  return ctx;
};

