"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "maintenance" | "inspection" | "repair"
  equipment: string
  priority: "low" | "medium" | "high"
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Oil change - Pump A",
    date: new Date(2024, 0, 15),
    type: "maintenance",
    equipment: "Pump A",
    priority: "medium",
  },
  {
    id: "2",
    title: "Motor bearing inspection",
    date: new Date(2024, 0, 18),
    type: "inspection",
    equipment: "Motor Unit 2",
    priority: "high",
  },
  {
    id: "3",
    title: "Hydraulic fluid flush",
    date: new Date(2024, 0, 20),
    type: "maintenance",
    equipment: "Hydraulic Press",
    priority: "high",
  },
  {
    id: "4",
    title: "Belt replacement",
    date: new Date(2024, 0, 25),
    type: "maintenance",
    equipment: "Air Compressor",
    priority: "low",
  },
]

export function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDaysArray = () => {
    const days = []
    const firstDay = firstDayOfMonth(currentDate)
    const daysCount = daysInMonth(currentDate)

    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysCount; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
    }
    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = getDaysArray()
  const selectedEvents = getEventsForDate(selectedDate)
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const getEventColor = (type: string, priority: string) => {
    if (priority === "high") return "bg-red-900/30 border-red-700 text-red-300"
    if (priority === "medium") return "bg-yellow-900/30 border-yellow-700 text-yellow-300"
    return "bg-blue-900/30 border-blue-700 text-blue-300"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Maintenance Calendar</h2>
          <p className="text-muted-foreground mt-1">Schedule and manage maintenance events</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">{monthName}</h3>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-2 hover:bg-input rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-input rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`aspect-square p-2 rounded-lg border transition-colors relative ${
                  day === null
                    ? "bg-transparent"
                    : selectedDate?.getDate() === day?.getDate() &&
                        selectedDate?.getMonth() === day?.getMonth() &&
                        selectedDate?.getFullYear() === day?.getFullYear()
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:bg-input text-foreground"
                }`}
              >
                {day && (
                  <>
                    <span className="text-xs font-medium">{day.getDate()}</span>
                    {getEventsForDate(day).length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
                        {getEventsForDate(day)
                          .slice(0, 3)
                          .map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : "Select a date"}
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event.type, event.priority)}`}>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs mt-1">{event.equipment}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-black/20 rounded">{event.type}</span>
                    <span className="text-xs px-2 py-1 bg-black/20 rounded">{event.priority}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">No events scheduled</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {mockEvents.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-start justify-between p-3 bg-input rounded-lg">
              <div>
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.equipment}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{event.date.toLocaleDateString()}</p>
                <span
                  className={`text-xs px-2 py-1 rounded border inline-block mt-1 ${getEventColor(
                    event.type,
                    event.priority,
                  )}`}
                >
                  {event.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
