"use client";
import { useEffect, useState } from "react";
import { gigStore } from "@/lib/store";
import { Gig, GigType } from "@/types";

const TYPE_LABELS: Record<GigType, string> = { vj: "VJ", stage_design: "עיצוב במה", led_rental: "השכרת LED", projection_mapping: "Projection Mapping", lighting: "תאורה", other: "אחר" };

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filter, setFilter] = useState<string>("all");
  useEffect(() => { setGigs(gigStore.getAll().sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())); }, []);
  const filtered = filter === "all" ? gigs : gigs.filter((g) => g.status === filter);
  const togglePaid = (id: string) => { const gig = gigs.find((g) => g.id === id); if (!gig) return; gigStore.update(id, { paymentStatus: gig.paymentStatus === "paid" ? "pending" : "paid" }); setGigs(gigStore.getAll().sort((a, b) => new Date(b.dateStart).getTime() - new Date(a.dateStart).getTime())); };
  const deleteGig = (id: string) => { if (!confirm("למחוק את הגיג?")) return; gigStore.remove(id); setGigs(gigStore.getAll()); };
  const filters = ["all","confirmed","tentative","completed","cancelled"];
  const filterLabels: Record<string,string> = {all:"הכל",confirmed:"מאושר",tentative:"טנטטיבי",completed:"הושלם",cancelled:"בוטל"};
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">גיגים</h1>
        <a href="/gigs/new" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition">+ גיג חדש</a>
      </div>
      <div className="flex gap-2 text-sm">{filters.map((s) => (
        <button key={s} onClick={() => setFilter(s)} className={"px-3 py-1 rounded-full transition " + (filter === s ? "bg-indigo-500 text-white" : "bg-[#141414] text-[#a1a1aa] hover:bg-[#1a1a1a]")}>{filterLabels[s]}</button>
      ))}</div>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[#a1a1aa]"><p className="text-4xl mb-2">🎵</p><p>אין גיגים עדיין</p><a href="/gigs/new" className="text-indigo-400 text-sm">הוסף את הגיג הראשון שלך</a></div>
      ) : (
        <div className="space-y-2">{filtered.map((gig) => (
          <div key={gig.id} className="bg-[#141414] border border-[#262626] rounded-xl p-4 hover:bg-[#1a1a1a] transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{gig.title}</h3>
                  <span className="text-xs bg-[#0a0a0a] px-2 py-0.5 rounded-full text-[#a1a1aa]">{TYPE_LABELS[gig.gigType]}</span>
                </div>
                <p className="text-sm text-[#a1a1aa]">{gig.clientName ? gig.clientName + " · " : ""}{new Date(gig.dateStart).toLocaleDateString("he-IL", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}{gig.location ? " · " + gig.location : ""}</p>
              </div>
              <div className="text-left flex items-center gap-3">
                <div>
                  <p className="font-bold text-lg">₪{gig.amount.toLocaleString()}</p>
                  <button onClick={() => togglePaid(gig.id)} className={"text-xs hover:underline " + (gig.paymentStatus === "paid" ? "text-green-400" : gig.paymentStatus === "overdue" ? "text-red-400" : "text-yellow-400")}>{gig.paymentStatus === "paid" ? "✓ שולם" : gig.paymentStatus === "overdue" ? "⚠ באיחור" : "○ ממתין"}</button>
                </div>
                <button onClick={() => deleteGig(gig.id)} className="text-[#a1a1aa] hover:text-red-400 text-lg">×</button>
              </div>
            </div>
          </div>
        ))}</div>
      )}
    </div>);
}