import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
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

const sampleEvents: Event[] = [
  {
    id: 1,
    title: "Community Health Workshop",
    start: new Date(2024, new Date().getMonth(), 15, 9, 0),
    end: new Date(2024, new Date().getMonth(), 15, 12, 0),
    description:
      "Health awareness and basic medical screening for Barangay San Jose residents",
  },
  {
    id: 2,
    title: "Literacy Program Planning",
    start: new Date(2024, new Date().getMonth(), 16, 14, 0),
    end: new Date(2024, new Date().getMonth(), 16, 16, 0),
    description:
      "Planning meeting for adult literacy program implementation in partner communities",
  },
  {
    id: 3,
    title: "Environmental Awareness Drive",
    start: new Date(2024, new Date().getMonth(), 20, 8, 0),
    end: new Date(2024, new Date().getMonth(), 20, 17, 0),
    description:
      "Tree planting and environmental education activity with local youth organizations",
  },
  {
    id: 4,
    title: "Skills Training Workshop",
    start: new Date(2024, new Date().getMonth(), 18, 13, 0),
    end: new Date(2024, new Date().getMonth(), 18, 17, 0),
    description:
      "Vocational skills training for out-of-school youth: Basic Electronics",
  },
  {
    id: 5,
    title: "CEC Board Meeting",
    start: new Date(2024, new Date().getMonth(), 22, 10, 0),
    end: new Date(2024, new Date().getMonth(), 22, 12, 0),
    description:
      "Monthly review of community extension programs and initiatives",
  },
  {
    id: 6,
    title: "Impact Assessment",
    start: new Date(2024, new Date().getMonth(), 17, 14, 0),
    end: new Date(2024, new Date().getMonth(), 17, 16, 0),
    description: "Evaluation of recent community programs' impact and outcomes",
  },
  {
    id: 7,
    title: "Stakeholders Meeting",
    start: new Date(2024, new Date().getMonth(), 25, 9, 0),
    end: new Date(2024, new Date().getMonth(), 25, 11, 0),
    description:
      "Coordination meeting with community leaders and partner organizations",
  },
  {
    id: 8,
    title: "Program Planning Session",
    start: new Date(2024, new Date().getMonth(), 19, 9, 0),
    end: new Date(2024, new Date().getMonth(), 19, 12, 0),
    description:
      "Strategic planning for upcoming community development initiatives",
  },
  {
    id: 9,
    title: "Community Workshop",
    start: new Date(2024, new Date().getMonth(), 23, 13, 0),
    end: new Date(2024, new Date().getMonth(), 23, 17, 0),
    description: "Sustainable livelihood workshop for local community members",
  },
  {
    id: 10,
    title: "Volunteer Orientation",
    start: new Date(2024, new Date().getMonth(), 21, 14, 0),
    end: new Date(2024, new Date().getMonth(), 21, 16, 0),
    description: "Orientation session for new community extension volunteers",
  },
  // Multi-day event
  {
    id: 11,
    title: "Community Development Summit",
    start: new Date(2024, new Date().getMonth(), 27, 8, 0),
    end: new Date(2024, new Date().getMonth(), 29, 17, 0),
    description:
      "Annual summit for community development planning and stakeholder engagement",
  },
  // Weekly recurring events
  ...Array.from({ length: 4 }, (_, i) => ({
    id: 12 + i,
    title: "Project Monitoring",
    start: new Date(2024, new Date().getMonth(), 15 + i, 9, 0),
    end: new Date(2024, new Date().getMonth(), 15 + i, 10, 30),
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
    start: new Date(2024, new Date().getMonth(), 15, 15, 0),
    end: new Date(2024, new Date().getMonth(), 15, 17, 0),
    description: "Weekly adult education sessions in partner communities",
  },
  4
);

// Combine all events
const allEvents = [...sampleEvents, ...weeklyPrograms];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(allEvents);

  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Events Calendar
          </h1>
          {/* Optional: Add action buttons here */}
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg transition-colors duration-150 ease-in-out hover:bg-indigo-700">
            + Add Event
          </button>
        </div>

        {/* Calendar Card */}
        <div className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          {/* Optional: Calendar Controls */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-4 items-center">
              <div className="text-sm text-gray-800 dark:text-gray-400">
                Today: {new Date().toLocaleDateString()}
              </div>
              {/* Optional: Add view toggles or filters here */}
            </div>
          </div>

          {/* Calendar Component */}
          <div className="p-6">
            <div className="h-[calc(100vh-240px)]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
                tooltipAccessor={(event) => event.description || ""}
                className="custom-calendar"
                // Additional props for better UX
                selectable={true}
                popup={true}
                longPressThreshold={250}
                // Optional: Event handlers
                onSelectSlot={(slotInfo) => {
                  console.log("Selected slot:", slotInfo);
                  // Handle slot selection (e.g., open create event modal)
                }}
                onSelectEvent={(event) => {
                  console.log("Selected event:", event);
                  // Handle event selection (e.g., open event details modal)
                }}
                // Custom event styling
                eventPropGetter={(event) => ({
                  className: "cursor-pointer",
                  style: {
                    backgroundColor: "rgb(79, 70, 229)", // indigo-600
                    border: "none",
                  },
                })}
                // Custom day styling
                dayPropGetter={(date) => ({
                  className:
                    "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150",
                })}
              />
            </div>
          </div>
        </div>

        {/* Optional: Legend or additional information */}
        <div className="flex gap-4 items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            <span>Events</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <span>Available Slots</span>
          </div>
        </div>
      </div>
    </div>
  );
}
