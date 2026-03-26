"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { gigStore, generateId } from "@/lib/store";
import { GigType, GigStatus } from "@/types";

export default function NewGigPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", clientName: "", dateStart: "", dateEnd: "", location: "", amount: "", status: "confirmed" as GigStatus, gigType: "vj" as GigType, notes: "" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); gigStore.add({ id: generateId(), ...form, amount: parseFloat(form.amount) || 0, currency: "ILS", paymentStatus: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); router.push("/gigs"); };
  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const ic = "w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none transition";
  const lc = "block text-sm text-[#a1a1aa] mb-1";
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">גיג חדש</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className={lc}>שם הגיג *</label><input className={ic} placeholder="VJ @ Club Kumod" value={form.title} onChange={(e) => update("title", e.target.value)} required /></div>
        <div><label className={lc}>לקוח</label><input className={ic} placeholder="שם הלקוח" value={form.clientName} onChange={(e) => update("clientName", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lc}>תאריך התחלה *</label><input type="datetime-local" className={ic} value={form.dateStart} onChange={(e) => update("dateStart", e.target.value)} required /></div>
          <div><label className={lc}>תאריך סיום</label><input type="datetime-local" className={ic} value={form.dateEnd} onChange={(e) => update("dateEnd", e.target.value)} /></div>
        </div>
        <div><label className={lc}>מיקום</label><input className={ic} placeholder="תל אביב" value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className={lc}>סכום (₪) *</label><input type="number" className={ic} placeholder="1500" value={form.amount} onChange={(e) => update("amount", e.target.value)} required /></div>
          <div><label className={lc}>סוג</label><select className={ic} value={form.gigType} onChange={(e) => update("gigType", e.target.value)}><option value="vj">VJ</option><option value="stage_design">עיצוב במה</option><option value="led_rental">השכרת LED</option><option value="projection_mapping">Projection Mapping</option><option value="lighting">תאורה</option><option value="other">אחר</option></select></div>
        </div>
        <div><label className={lc}>סטטוס</label><select className={ic} value={form.status} onChange={(e) => update("status", e.target.value)}><option value="confirmed">מאושר</option><option value="tentative">טנטטיבי</option></select></div>
        <div><label className={lc}>הערות</label><textarea className={ic} rows={3} placeholder="פרטים נוספים..." value={form.notes} onChange={(e) => update("notes", e.target.value)} /></div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white py-2.5 rounded-lg font-medium transition">שמור גיג</button>
          <button type="button" onClick={() => router.back()} className="px-6 bg-[#141414] border border-[#262626] text-[#a1a1aa] py-2.5 rounded-lg transition hover:bg-[#1a1a1a]">ביטול</button>
        </div>
      </form>
    </div>);
}