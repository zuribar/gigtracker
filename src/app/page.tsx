"use client";
import { useEffect, useState } from "react";
import { gigStore, expenseStore } from "@/lib/store";
import { Gig, Expense, MonthlyStats } from "@/types";

function getMonthlyStats(gigs: Gig[], expenses: Expense[]): MonthlyStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const monthGigs = gigs.filter((g) => { const d = new Date(g.dateStart); return d.getMonth() === month && d.getFullYear() === year; });
  const monthExpenses = expenses.filter((e) => { const d = new Date(e.date); return d.getMonth() === month && d.getFullYear() === year; });
  const totalIncome = monthGigs.filter((g) => g.paymentStatus === "paid").reduce((sum, g) => sum + g.amount, 0);
  const totalExpenses = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  return { totalIncome, totalExpenses, profit: totalIncome - totalExpenses, gigCount: monthGigs.length, paidCount: monthGigs.filter((g) => g.paymentStatus === "paid").length, pendingCount: monthGigs.filter((g) => g.paymentStatus === "pending").length };
}

export default function Dashboard() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  useEffect(() => { const g = gigStore.getAll(); const e = expenseStore.getAll(); setGigs(g); setExpenses(e); setStats(getMonthlyStats(g, e)); }, []);
  const upcomingGigs = gigs.filter((g) => new Date(g.dateStart) >= new Date() && g.status !== "cancelled").sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()).slice(0, 5);
  const monthName = new Date().toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">דשבורד</h1>
        <a href="/gigs/new" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition">+ גיג חדש</a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4"><p className="text-[#a1a1aa] text-xs mb-1">הכנסות {monthName}</p><p className="text-2xl font-bold text-green-500">{stats ? "₪" + stats.totalIncome.toLocaleString() : "..."}</p></div>
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4"><p className="text-[#a1a1aa] text-xs mb-1">הוצאות</p><p className="text-2xl font-bold text-red-500">{stats ? "₪" + stats.totalExpenses.toLocaleString() : "..."}</p></div>
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4"><p className="text-[#a1a1aa] text-xs mb-1">רווח נקי</p><p className={"text-2xl font-bold " + (stats && stats.profit >= 0 ? "text-green-500" : "text-red-500")}>{stats ? "₪" + stats.profit.toLocaleString() : "..."}</p></div>
        <div className="bg-[#141414] border border-[#262626] rounded-xl p-4"><p className="text-[#a1a1aa] text-xs mb-1">גיגים החודש</p><p className="text-2xl font-bold">{stats ? stats.gigCount : "..."}</p><p className="text-xs text-[#a1a1aa]">{stats ? stats.paidCount + " שולמו | " + stats.pendingCount + " ממתינים" : ""}</p></div>
      </div>
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-4">
        <h2 className="font-semibold mb-3">גיגים קרובים</h2>
        {upcomingGigs.length === 0 ? (<p className="text-[#a1a1aa] text-sm">אין גיגים קרובים. <a href="/gigs/new" className="text-indigo-400">הוסף גיג</a></p>) : (
          <div className="space-y-2">{upcomingGigs.map((gig) => (
            <div key={gig.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#1a1a1a] transition">
              <div><p className="font-medium">{gig.title}</p><p className="text-xs text-[#a1a1aa]">{new Date(gig.dateStart).toLocaleDateString("he-IL", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}{gig.location ? " · " + gig.location : ""}</p></div>
              <span className="font-semibold">₪{gig.amount.toLocaleString()}</span>
            </div>))}</div>)}
      </div>
    </div>);
}