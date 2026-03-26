"use client";
import { useEffect, useState } from "react";
import { gigStore } from "@/lib/store";
import { Gig } from "@/types";

const DAYS_HE = ["א׳","ב׳","ג׳","ד׳","ה׳","ו׳","ש׳"];

export default function CalendarPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  useEffect(() => { setGigs(gigStore.getAll()); }, []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  const gigsOnDay = (day: number) => gigs.filter((g) => { const d = new Date(g.dateStart); return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year; });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className="text-[#a1a1aa] hover:text-white px-3 py-1">←</button>
        <h1 className="text-xl font-bold">{monthName}</h1>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className="text-[#a1a1aa] hover:text-white px-3 py-1">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_HE.map((d) => (<div key={d} className="text-center text-xs text-[#a1a1aa] py-2">{d}</div>))}
        {Array.from({ length: firstDay }, (_, i) => (<div key={"e"+i} />))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayGigs = gigsOnDay(day);
          const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
          return (
            <div key={day} className={"min-h-[70px] p-1 rounded-lg border transition " + (isToday ? "border-indigo-500 bg-indigo-500/10" : "border-[#262626] bg-[#141414]")}>
              <span className={"text-xs " + (isToday ? "text-indigo-400 font-bold" : "text-[#a1a1aa]")}>{day}</span>
              {dayGigs.map((g) => (<div key={g.id} className={"mt-1 text-[10px] px-1 py-0.5 rounded bg-purple-500 text-white truncate"}>{g.title}</div>))}
            </div>
          );
        })}
      </div>
    </div>
  );
}