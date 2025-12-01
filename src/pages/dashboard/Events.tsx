import { Calendar, Plus, MapPin, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Events = () => {
  const upcomingEvents = [
    {
      name: "Intramurals 2025",
      type: "Sports Event",
      date: "Feb 15-17, 2025",
      status: "Upcoming",
      venue: "UMTC Gymnasium",
      products: 12,
      target: 50000,
      attendance: 500,
    },
    {
      name: "Foundation Week",
      type: "University Festival",
      date: "Mar 10-15, 2025",
      status: "Planning",
      venue: "UMTC Campus",
      products: 15,
      target: 75000,
      attendance: 1000,
    },
  ];

  const pastEvents = [
    {
      name: "ICT Week 2024",
      type: "Department Event",
      date: "Dec 5-8, 2024",
      status: "Completed",
      venue: "CoDeS Lab",
      products: 10,
      actual: 42500,
      target: 40000,
      transactions: 156,
    },
    {
      name: "Christmas Bazaar",
      type: "Holiday Event",
      date: "Dec 18-20, 2024",
      status: "Completed",
      venue: "UMTC Plaza",
      products: 8,
      actual: 35000,
      target: 30000,
      transactions: 124,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Manage CoDeS merchandise events</p>
        </div>
        <Button className="gap-2">
          <Plus size={20} />
          Create Event
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="p-6 border-l-4 border-l-primary">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground">{event.type}</p>
                </div>
                <Badge className="bg-primary">{event.status}</Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-muted-foreground" />
                  <span>Expected: {event.attendance} attendees</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Products</p>
                    <p className="font-bold">{event.products}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Target</p>
                    <p className="font-bold">₱{event.target.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Manage</Button>
                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Past Events</h2>
        <div className="grid grid-cols-1 gap-4">
          {pastEvents.map((event, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Calendar className="text-muted-foreground" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.type} • {event.date}</p>
                      </div>
                      <Badge variant="secondary">{event.status}</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-bold text-success">₱{event.actual.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-bold">₱{event.target.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Transactions</p>
                        <p className="font-bold">{event.transactions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Performance</p>
                        <p className="font-bold">{((event.actual / event.target) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Report</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;