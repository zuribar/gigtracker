import { Gig, Expense, Client } from "@/types";

const GIGS_KEY = "gigtracker_gigs";
const EXPENSES_KEY = "gigtracker_expenses";
const CLIENTS_KEY = "gigtracker_clients";

function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}

export const gigStore = {
  getAll: (): Gig[] => getItems<Gig>(GIGS_KEY),
  save: (gigs: Gig[]) => setItems(GIGS_KEY, gigs),
  add: (gig: Gig) => {
    const gigs = gigStore.getAll();
    gigs.push(gig);
    gigStore.save(gigs);
  },
  update: (id: string, updates: Partial<Gig>) => {
    const gigs = gigStore.getAll().map((g) =>
      g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
    );
    gigStore.save(gigs);
  },
  remove: (id: string) => {
    gigStore.save(gigStore.getAll().filter((g) => g.id !== id));
  },
};

export const expenseStore = {
  getAll: (): Expense[] => getItems<Expense>(EXPENSES_KEY),
  save: (expenses: Expense[]) => setItems(EXPENSES_KEY, expenses),
  add: (expense: Expense) => {
    const expenses = expenseStore.getAll();
    expenses.push(expense);
    expenseStore.save(expenses);
  },
  remove: (id: string) => {
    expenseStore.save(expenseStore.getAll().filter((e) => e.id !== id));
  },
};

export const clientStore = {
  getAll: (): Client[] => getItems<Client>(CLIENTS_KEY),
  save: (clients: Client[]) => setItems(CLIENTS_KEY, clients),
  add: (client: Client) => {
    const clients = clientStore.getAll();
    clients.push(client);
    clientStore.save(clients);
  },
};

export function generateId(): string {
  return crypto.randomUUID();
}