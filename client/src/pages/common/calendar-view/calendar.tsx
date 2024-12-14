import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import { parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { activitiesApi } from "@/services/api/activities.service";
import { Skeleton } from "@/components/ui/skeleton";
import "./calendar.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  extendedProps?: {
    proposalId: number;
    description: string;
  };
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: activitiesResponse, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: activitiesApi.getActivities,
  });

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.success) {
      const formattedEvents = activitiesResponse.data.map((activity: any) => ({
        id: String(activity.id),
        title: activity.title,
        start: parseISO(activity.targetDate),
        end: new Date(
          parseISO(activity.targetDate).getTime() + 24 * 60 * 60 * 1000
        ), // Add one day for end date
        description: activity.description,
        allDay: true, // Set this to true for all-day events
        extendedProps: {
          proposalId: activity.proposalId,
          description: activity.description,
        },
      }));
      setEvents(formattedEvents);
    }
  }, [activitiesResponse]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    console.log(info.event);
  };

  const handleDateSelect = (selectInfo: any) => {
    console.log("Selected slot:", {
      start: selectInfo.start,
      end: selectInfo.end,
    });
  };

  // const handleApprove = () => {
  //   if (selectedEvent) {
  //     const proposalId = selectedEvent.extendedProps?.proposalId;
  //     if (proposalId !== undefined) {
  //       createActivity(proposalId);
  //     } else {
  //       console.log("Proposal ID is missing");
  //     }
  //   } else {
  //     console.log("No event selected");
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track all community extension activities
          </p>
        </div>
        {/* <button
          onClick={handleApprove}
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Approve
        </button> */}
      </div>

      {isLoading ? (
        <div className="p-6">
          <Skeleton className="mb-4 w-48 h-10" />
          {[...Array(1)].map((_, index) => (
            <Skeleton key={index} className="mb-2 h-12" />
          ))}
          <Skeleton className="h-96" />
        </div>
      ) : (
        <div className="rounded-xl border shadow bg-card text-card-foreground">
          <div className="p-6">
            <TooltipProvider>
              <FullCalendar
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  multiMonthPlugin,
                  listPlugin,
                ]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left:
                    window.innerWidth < 768 ? "prev,next" : "prev,next today",
                  center: "title",
                  right:
                    window.innerWidth < 768
                      ? "dayGridMonth,listMonth"
                      : "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                }}
                events={events.map((event) => ({
                  ...event,
                  id: String(event.id),
                  extendedProps: {
                    description: event.description,
                    proposalId: event.extendedProps?.proposalId,
                  },
                }))}
                height="calc(100vh - 320px)"
                selectable={true}
                selectMirror={true}
                dayMaxEvents={3}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "rounded-md border-none transition-all hover:opacity-80",
                            "overflow-hidden max-h-full",
                            selectedEvent?.id === eventInfo.event.id &&
                              "ring-2 ring-primary"
                          )}
                        >
                          <div className="text-sm font-semibold truncate">
                            {eventInfo.event.title}
                          </div>
                          {eventInfo.view.type === "dayGridMonth" && (
                            <div className="text-xs truncate opacity-75">
                              {eventInfo.event.extendedProps?.description}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{eventInfo.event.title}</p>
                        <p className="text-xs">
                          {eventInfo.event.extendedProps?.description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
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
                    dayMaxEventRows: window.innerWidth < 768 ? 2 : 3,
                    dayMaxEvents: window.innerWidth < 768 ? 2 : 3,
                  },
                  timeGridWeek: {
                    dayMaxEvents: true,
                    slotEventOverlap: false,
                  },
                  multiMonthYear: {
                    multiMonthMaxColumns: window.innerWidth < 768 ? 1 : 3,
                    duration: { years: 1 },
                    dayMaxEventRows: 3,
                    showNonCurrentDates: false,
                  },
                  listMonth: {
                    listDayFormat: {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                    listDaySideFormat: { weekday: "long" },
                  },
                }}
                handleWindowResize={true}
                windowResizeDelay={100}
                aspectRatio={1.8}
                loading={(isLoading) => {
                  console.log("Calendar loading:", isLoading);
                }}
                lazyFetching={true}
                eventMaxStack={3}
                // weekNumbers={true}
                // weekText="Week "
                // navLinks={true}
              />
            </TooltipProvider>
          </div>
        </div>
      )}

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
