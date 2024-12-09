import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import { parseISO } from 'date-fns';
import { cn } from "@/lib/utils";
import { activitiesApi } from "@/services/api/activities.service";
import "./calendar.css";

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: activitiesResponse, isLoading, error } = useQuery({
    queryKey: ["activities"],
    queryFn: activitiesApi.getActivities,
  });

  const { mutate: createActivity } = useMutation({
    mutationFn: activitiesApi.createActivity,
    onSuccess: () => {
      console.log("Activity created successfully");
      // Optionally refetch activities or update state
    },
    onError: (error) => {
      console.error("Error creating activity:", error);
    },
  });

  useEffect(() => {
    if (activitiesResponse && activitiesResponse.success) {
      const formattedEvents = activitiesResponse.data.map((activity: any) => ({
        id: String(activity.id),
        title: activity.title,
        start: parseISO(activity.targetDate),
        end: new Date(parseISO(activity.targetDate).getTime() + 24 * 60 * 60 * 1000), // Add one day for end date
        description: activity.description,
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

  const handleApprove = () => {
    if (selectedEvent) {
      const proposalId = selectedEvent.extendedProps?.proposalId;
      if (proposalId !== undefined) {
        createActivity(proposalId);
      } else {
        console.log("Proposal ID is missing");
      }
    } else {
      console.log("No event selected");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events Calendar</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track all community extension activities
          </p>
        </div>
        <button
          onClick={handleApprove}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Approve
        </button>
      </div>

      <div className="rounded-xl border shadow bg-card text-card-foreground">
        <div className="p-6">
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
              left: "prev,next today",
              center: "title",
              right:
                "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listMonth",
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
                duration: { years: 1 },
                dayMaxEventRows: 2,
                showNonCurrentDates: false,
                dayHeaderFormat: { weekday: "short" },
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
          />
        </div>
      </div>

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
