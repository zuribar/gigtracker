"use client";
import { useEffect, useState } from "react";
import { expenseStore, generateId } from "@/lib/store";
import { Expense, ExpenseCategory } from "@/types";

const CAT_LABELS: Record<ExpenseCategory, string> = { equipment: "ציוד", travel: "נסיעות", software: "תוכנה", supplies: "חומרים", other: "אחר" };
const CAT_EMOJI: Record<ExpenseCategory, string> = { equipment: "🔧", travel: "🚗", software: "💻", supplies: "📦", other: "📝" };

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description: "", amount: "", date: new Date().toISOString().slice(0, 10), category: "equipment" as ExpenseCategory });
  useEffect(() => { setExpenses(expenseStore.getAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); }, []);
  const addExpense = (e: React.FormEvent) => { e.preventDefault(); expenseStore.add({ id: generateId(), ...form, amount: parseFloat(form.amount) || 0, currency: "ILS", createdAt: new Date().toISOString() }); setExpenses(expenseStore.getAll().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); setForm({ description: "", amount: "", date: new Date().toISOString().slice(0, 10), category: "equipment" }); setShowForm(false); };
  const deleteExpense = (id: string) => { expenseStore.remove(id); setExpenses(expenseStore.getAll()); };
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const ic = "w-full bg-[#0a0a0a] border border-[#262626] rounded-lg px-3 py-2 text-white text-sm focus:border-indigo-500 focus:outline-none";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">הוצאות</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition">+ הוצאה חדשה</button>
      </div>
      <div className="bg-[#141414] border border-[#262626] rounded-xl p-4"><p className="text-[#a1a1aa] text-xs">סה"כ הוצאות</p><p className="text-2xl font-bold text-red-500">₪{total.toLocaleString()}</p></div>
      {showForm && (
        <form onSubmit={addExpense} className="bg-[#141414] border border-[#262626] rounded-xl p-4 space-y-3">
          <input className={ic} placeholder="תיאור" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-3 gap-3">
            <input type="number" className={ic} placeholder="סכום" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <input type="date" className={ic} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className={ic} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>{Object.entries(CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </div>
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm w-full">שמור</button>
        </form>
      )}
      <div className="space-y-2">{expenses.map((exp) => (
        <div key={exp.id} className="bg-[#141414] border border-[#262626] rounded-xl p-3 flex items-center justify-between hover:bg-[#1a1a1a] transition">
          <div className="flex items-center gap-3">
            <span className="text-xl">{CAT_EMOJI[exp.category]}</span>
            <div><p className="font-medium text-sm">{exp.description}</p><p className="text-xs text-[#a1a1aa]">{new Date(exp.date).toLocaleDateString("he-IL")} · {CAT_LABELS[exp.category]}</p></div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-red-500">-₪{exp.amount.toLocaleString()}</span>
            <button onClick={() => deleteExpense(exp.id)} className="text-[#a1a1aa] hover:text-red-400">×</button>
          </div>
        </div>
      ))}</div>
    </div>);
}