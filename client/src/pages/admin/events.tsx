import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { format } from "date-fns";
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
import "./calendar.css";

// Define event type
interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  extendedProps?: {
    description: string;
  };
}

const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Community Health Workshop",
    start: new Date(2024, 1, 15, 9, 0),
    end: new Date(2024, 1, 15, 12, 0),
    description:
      "Health awareness and basic medical screening for Barangay San Jose residents",
  },
  {
    id: 2,
    title: "Literacy Program Planning",
    start: new Date(2024, 1, 16, 14, 0),
    end: new Date(2024, 1, 16, 16, 0),
    description:
      "Planning meeting for adult literacy program implementation in partner communities",
  },
  {
    id: 3,
    title: "Environmental Awareness Drive",
    start: new Date(2024, 1, 20, 8, 0),
    end: new Date(2024, 1, 20, 17, 0),
    description:
      "Tree planting and environmental education activity with local youth organizations",
  },
  {
    id: 4,
    title: "Skills Training Workshop",
    start: new Date(2024, 1, 18, 13, 0),
    end: new Date(2024, 1, 18, 17, 0),
    description:
      "Vocational skills training for out-of-school youth: Basic Electronics",
  },
  {
    id: 5,
    title: "CEC Board Meeting",
    start: new Date(2024, 1, 22, 10, 0),
    end: new Date(2024, 1, 22, 12, 0),
    description:
      "Monthly review of community extension programs and initiatives",
  },
  {
    id: 6,
    title: "Impact Assessment",
    start: new Date(2024, 1, 17, 14, 0),
    end: new Date(2024, 1, 17, 16, 0),
    description: "Evaluation of recent community programs' impact and outcomes",
  },
  {
    id: 7,
    title: "Stakeholders Meeting",
    start: new Date(2024, 1, 25, 9, 0),
    end: new Date(2024, 1, 25, 11, 0),
    description:
      "Coordination meeting with community leaders and partner organizations",
  },
  {
    id: 8,
    title: "Program Planning Session",
    start: new Date(2024, 1, 19, 9, 0),
    end: new Date(2024, 1, 19, 12, 0),
    description:
      "Strategic planning for upcoming community development initiatives",
  },
  {
    id: 9,
    title: "Community Workshop",
    start: new Date(2024, 1, 23, 13, 0),
    end: new Date(2024, 1, 23, 17, 0),
    description: "Sustainable livelihood workshop for local community members",
  },
  {
    id: 10,
    title: "Volunteer Orientation",
    start: new Date(2024, 1, 21, 14, 0),
    end: new Date(2024, 1, 21, 16, 0),
    description: "Orientation session for new community extension volunteers",
  },
  // Multi-day event
  {
    id: 11,
    title: "Community Development Summit",
    start: new Date(2024, 1, 27, 8, 0),
    end: new Date(2024, 1, 29, 17, 0),
    description:
      "Annual summit for community development planning and stakeholder engagement",
  },
  // Weekly recurring events
  ...Array.from({ length: 4 }, (_, i) => ({
    id: 12 + i,
    title: "Project Monitoring",
    start: new Date(2024, 1, 15 + i, 9, 0),
    end: new Date(2024, 1, 15 + i, 10, 30),
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
    start: new Date(2024, 1, 15, 15, 0),
    end: new Date(2024, 1, 15, 17, 0),
    description: "Weekly adult education sessions in partner communities",
  },
  4
);

// Combine all events
const allEvents = [...sampleEvents, ...weeklyPrograms];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Handle event click
  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
  };

  // Handle date selection
  const handleDateSelect = (selectInfo: any) => {
    console.log("Selected slot:", {
      start: selectInfo.start,
      end: selectInfo.end,
    });
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
        {/* <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Event
        </Button> */}
      </div>

      {/* Controls Section */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-8" />
        </div> */}

        {/* <div className="flex gap-2 justify-center items-center">
          <span className="text-sm font-medium">
            {format(date, "MMMM yyyy")}
          </span>
        </div> */}

        {/* <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter Events
        </Button> */}
      </div>

      {/* Calendar Card */}
      <div className="rounded-xl border shadow bg-card text-card-foreground">
        <div className="p-6">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              multiMonthPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events.map((event) => ({
              ...event,
              extendedProps: {
                description: event.description,
              },
            }))}
            height="calc(100vh - 320px)"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={(eventInfo) => {
              return (
                <div
                  className={cn(
                    "rounded-md border-none transition-opacity hover:opacity-80 p-1",
                    selectedEvent?.id === eventInfo.event.id &&
                      "ring-2 ring-primary"
                  )}
                >
                  <div className="font-semibold">{eventInfo.event.title}</div>
                  {eventInfo.view.type === "dayGridMonth" && (
                    <div className="text-xs">
                      {eventInfo.event.extendedProps?.description}
                    </div>
                  )}
                </div>
              );
            }}
            firstDay={1}
            weekends={true}
            editable={true}
            droppable={true}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={true}
            allDayText="All Day"
            slotDuration="00:30:00"
            slotLabelInterval="01:00"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            dayHeaderFormat={{
              weekday: "short",
              day: "numeric",
              omitCommas: true,
            }}
            views={{
              dayGridMonth: {
                dayMaxEventRows: 4,
                dayHeaderFormat: { weekday: "short" },
              },
              timeGridWeek: {
                dayHeaderFormat: { weekday: "short", day: "numeric" },
              },
              multiMonthYear: {
                multiMonthMaxColumns: 3,
                multiMonthMinWidth: 300,
              },
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
