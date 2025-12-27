"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: string
  equipment: string
  type: "preventive"
}

const mockEvents: CalendarEvent[] = [
  {
    id: "e1",
    title: "Oil change - Pump A",
    date: "2024-01-15",
    equipment: "Pump A",
    type: "preventive",
  },
  {
    id: "e2",
    title: "Belt inspection - Motor B",
    date: "2024-01-20",
    equipment: "Motor B",
    type: "preventive",
  },
  {
    id: "e3",
    title: "Fluid replacement - Hydraulic",
    date: "2024-01-25",
    equipment: "Hydraulic Press",
    type: "preventive",
  },
]

export function PreventiveMaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1))
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const selectedDateObj = selectedDate ? new Date(selectedDate) : null
  const eventsForSelectedDate = selectedDate ? mockEvents.filter((e) => e.date === selectedDate) : []

  const hasEventOnDay = (day: number) => {
    if (!day) return false
    const dateStr = `2024-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockEvents.some((e) => e.date === dateStr)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-card border border-border rounded-lg p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 hover:bg-input rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 hover:bg-input rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs md:text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map((day, idx) => {
              const dateStr = day
                ? `2024-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : ""
              const hasEvent = hasEventOnDay(day || 0)
              const isSelected = selectedDate === dateStr

              return (
                <button
                  key={idx}
                  onClick={() => day && setSelectedDate(dateStr)}
                  disabled={!day}
                  className={`aspect-square rounded-lg text-sm font-medium transition-colors relative ${
                    !day
                      ? "bg-transparent"
                      : isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border text-foreground hover:bg-input"
                  }`}
                >
                  {day}
                  {hasEvent && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {selectedDate && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">{new Date(selectedDate).toLocaleDateString()}</h3>

            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {eventsForSelectedDate.map((event) => (
                  <div key={event.id} className="bg-background rounded-lg p-3 border border-border">
                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.equipment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events scheduled</p>
            )}

            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
              <Plus className="w-4 h-4" />
              Schedule Request
            </button>
          </div>
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 bg-background rounded-lg text-sm cursor-pointer hover:bg-input transition-colors"
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
