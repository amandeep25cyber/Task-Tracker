import { Card } from "../../components/ui/Card";
import { ChevronLeft, ChevronRight, Clock, Plus, X } from "lucide-react";
import { useState } from "react";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const typeColors = {
  meeting: "bg-blue-100 text-blue-700 border-blue-200",
  deadline: "bg-red-100 text-red-700 border-red-200",
  reminder: "bg-amber-100 text-amber-700 border-amber-200",
};

const today = new Date();

const initialEvents = [
  { id: 1, title: "Team Standup", time: "9:00 AM", day: today.getDate(), month: today.getMonth(), year: today.getFullYear(), type: "meeting" },
  { id: 2, title: "Design Review", time: "2:00 PM", day: today.getDate() + 2, month: today.getMonth(), year: today.getFullYear(), type: "meeting" },
  { id: 3, title: "Sprint Deadline", time: "5:00 PM", day: today.getDate() + 7, month: today.getMonth(), year: today.getFullYear(), type: "deadline" },
  { id: 4, title: "Sprint Planning", time: "10:00 AM", day: today.getDate() + 4, month: today.getMonth(), year: today.getFullYear(), type: "meeting" },
  { id: 5, title: "Code Review", time: "3:30 PM", day: today.getDate() + 1, month: today.getMonth(), year: today.getFullYear(), type: "reminder" },
];

const Calendar = ()=> {
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState(initialEvents);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "9:00 AM", type: "meeting" });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const eventsForDay = (day) =>
    events.filter((e) => e.day === day && e.month === month && e.year === year);

  const upcomingEvents = events
    .filter((e) => {
      const d = new Date(e.year, e.month, e.day);
      return d >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    })
    .sort((a, b) => new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime())
    .slice(0, 6);

  const addEvent = () => {
    if (!newEvent.title.trim() || !selectedDay) return;
    setEvents((prev) => [
      ...prev,
      { id: Date.now(), title: newEvent.title, time: newEvent.time, day: selectedDay, month, year, type: newEvent.type },
    ]);
    setNewEvent({ title: "", time: "9:00 AM", type: "meeting" });
    setShowAddModal(false);
  };

  const formatEventDate = (e) => {
    const d = new Date(e.year, e.month, e.day);
    const isEventToday = d.toDateString() === today.toDateString();
    const isTomorrow = d.toDateString() === new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toDateString();
    if (isEventToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return `${MONTH_NAMES[e.month].substring(0, 3)} ${e.day}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendar</h1>
          <p className="text-gray-600">Track your schedule and deadlines</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {MONTH_NAMES[month]} {year}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={prevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dayEvents = eventsForDay(day);
                  const isSelected = day === selectedDay;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square flex flex-col items-center justify-start pt-1 rounded-xl text-sm transition-all relative ${
                        isToday(day)
                          ? "bg-blue-600 text-white font-bold shadow-sm shadow-blue-200"
                          : isSelected
                          ? "bg-blue-50 text-blue-700 font-semibold ring-2 ring-blue-200"
                          : "hover:bg-gray-50 text-gray-900"
                      }`}
                    >
                      {day}
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayEvents.slice(0, 3).map((e, i) => (
                            <span
                              key={i}
                              className={`w-1 h-1 rounded-full ${
                                isToday(day) ? "bg-white/70" :
                                e.type === "meeting" ? "bg-blue-500" :
                                e.type === "deadline" ? "bg-red-500" : "bg-amber-500"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedDay && eventsForDay(selectedDay).length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    {isToday(selectedDay) ? "Today" : `${MONTH_NAMES[month]} ${selectedDay}`} — {eventsForDay(selectedDay).length} event{eventsForDay(selectedDay).length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {eventsForDay(selectedDay).map((e) => (
                      <div key={e.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${typeColors[e.type]}`}>
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="font-medium text-sm">{e.title}</span>
                        <span className="ml-auto text-xs opacity-70">{e.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <Card title="Upcoming Events">
            <div className="space-y-2">
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
              )}
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => { setCurrentDate(new Date(event.year, event.month, 1)); setSelectedDay(event.day); }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">{event.title}</h4>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${typeColors[event.type]} ml-2 shrink-0`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {event.time} · {formatEventDate(event)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Add Event</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Title</label>
                <input
                  autoFocus
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Time</label>
                <input
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <p className="text-xs text-gray-500">
                Event will be added to {selectedDay ? `${MONTH_NAMES[month]} ${selectedDay}` : "selected day"}
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                disabled={!newEvent.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Calendar;