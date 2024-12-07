import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

// Define event type
interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Define a base date to use for all events (e.g., March 2024)
const EVENTS_MONTH = 2; // 0-based index, so 2 = March
const EVENTS_YEAR = 2024;

const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Community Health Workshop",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 15, 9, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 15, 12, 0),
    description:
      "Health awareness and basic medical screening for Barangay San Jose residents",
  },
  {
    id: 2,
    title: "Literacy Program Planning",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 16, 14, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 16, 16, 0),
    description:
      "Planning meeting for adult literacy program implementation in partner communities",
  },
  {
    id: 3,
    title: "Environmental Awareness Drive",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 20, 8, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 20, 17, 0),
    description:
      "Tree planting and environmental education activity with local youth organizations",
  },
  {
    id: 4,
    title: "Skills Training Workshop",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 18, 13, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 18, 17, 0),
    description:
      "Vocational skills training for out-of-school youth: Basic Electronics",
  },
  {
    id: 5,
    title: "CEC Board Meeting",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 22, 10, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 22, 12, 0),
    description:
      "Monthly review of community extension programs and initiatives",
  },
  {
    id: 6,
    title: "Impact Assessment",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 17, 14, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 17, 16, 0),
    description: "Evaluation of recent community programs' impact and outcomes",
  },
  {
    id: 7,
    title: "Stakeholders Meeting",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 25, 9, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 25, 11, 0),
    description:
      "Coordination meeting with community leaders and partner organizations",
  },
  {
    id: 8,
    title: "Program Planning Session",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 19, 9, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 19, 12, 0),
    description:
      "Strategic planning for upcoming community development initiatives",
  },
  {
    id: 9,
    title: "Community Workshop",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 23, 13, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 23, 17, 0),
    description: "Sustainable livelihood workshop for local community members",
  },
  {
    id: 10,
    title: "Volunteer Orientation",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 21, 14, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 21, 16, 0),
    description: "Orientation session for new community extension volunteers",
  },
  // Multi-day event
  {
    id: 11,
    title: "Community Development Summit",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 27, 8, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 29, 17, 0),
    description:
      "Annual summit for community development planning and stakeholder engagement",
  },
  // Weekly recurring events
  ...Array.from({ length: 4 }, (_, i) => ({
    id: 12 + i,
    title: "Project Monitoring",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 15 + i, 9, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 15 + i, 10, 30),
    description: "Regular monitoring of ongoing community extension projects",
  })),
];

// Helper function to generate events for demo purposes
const generateRecurringEvents = (baseEvent: Event, count: number): Event[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...baseEvent,
    id: baseEvent.id + i,
    start: new Date(baseEvent.start.getTime() + i * 24 * 60 * 60 * 1000),
    end: new Date(baseEvent.end.getTime() + i * 24 * 60 * 60 * 1000),
  }));
};

// Add recurring weekly community programs
const weeklyPrograms = generateRecurringEvents(
  {
    id: 20,
    title: "Adult Education Program",
    start: new Date(EVENTS_YEAR, EVENTS_MONTH, 15, 15, 0),
    end: new Date(EVENTS_YEAR, EVENTS_MONTH, 15, 17, 0),
    description: "Weekly adult education sessions in partner communities",
  },
  4
);

// Combine all events
const allEvents = [...sampleEvents, ...weeklyPrograms];

// Add custom styles
const calendarStyles = {
  height: "calc(100vh - 320px)",
  padding: "20px",
};

export default function EventsPage() {
  // Initialize with the first day of the current month
  const initialDate = new Date();
  initialDate.setDate(1); // Set to first day of current month

  const [events, setEvents] = useState<Event[]>(allEvents);
  const [view, setView] = useState<Views>("month");
  const [date, setDate] = useState(initialDate);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Updated navigation handler with proper date handling
  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    const newDate = new Date(date);

    switch (action) {
      case "PREV":
        if (view === "month") {
          // For month view, set to first day of previous month
          newDate.setMonth(date.getMonth() - 1, 1);
        } else if (view === "week") {
          newDate.setDate(date.getDate() - 7);
        } else if (view === "day") {
          newDate.setDate(date.getDate() - 1);
        }
        break;

      case "NEXT":
        if (view === "month") {
          // For month view, set to first day of next month
          newDate.setMonth(date.getMonth() + 1, 1);
        } else if (view === "week") {
          newDate.setDate(date.getDate() + 7);
        } else if (view === "day") {
          newDate.setDate(date.getDate() + 1);
        }
        break;

      case "TODAY":
        const today = new Date();
        if (view === "month") {
          // For month view, set to first day of current month
          today.setDate(1);
        }
        newDate.setTime(today.getTime());
        break;
    }
    setDate(newDate);
  };

  // Handle event selection
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
  };

  // Handle slot selection (for creating new events)
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    // Handle new event creation
    console.log("Selected slot:", { start, end });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track all community extension activities
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Controls Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-8" />
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate("TODAY")}
          >
            <CalendarDays className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate("PREV")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigate("NEXT")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(date, "MMMM yyyy")}
          </span>
        </div>

        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter Events
        </Button>
      </div>

      {/* Calendar Card */}
      <div className="rounded-xl border shadow bg-card text-card-foreground">
        <div className="p-6">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={calendarStyles}
            view={view}
            onView={setView}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            popup
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            tooltipAccessor={(event) => event.description || ""}
            eventPropGetter={(event) => ({
              className: cn(
                "rounded-md border-none transition-opacity hover:opacity-80",
                selectedEvent?.id === event.id && "ring-2 ring-primary"
              ),
              style: {
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              },
            })}
            dayPropGetter={(date) => ({
              className: cn(
                "cursor-pointer transition-colors custom-calendar hover:bg-muted",
                date.getMonth() === initialDate.getMonth()
                  ? "current-month"
                  : "other-month"
              ),
            })}
            toolbar={true}
            messages={{
              today: "Today",
              previous: "Previous",
              next: "Next",
              month: "Month",
              week: "Week",
              day: "Day",
              agenda: "Agenda",
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Regular Events</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span>Important Events</span>
        </div>
        <div className="flex gap-2 items-center">
          <div className="w-3 h-3 rounded-full bg-muted" />
          <span>Available Slots</span>
        </div>
      </div>
    </div>
  );
}
