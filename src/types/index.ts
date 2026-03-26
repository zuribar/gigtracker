export type GigStatus = "confirmed" | "tentative" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "overdue";
export type GigType = "vj" | "stage_design" | "led_rental" | "projection_mapping" | "lighting" | "other";
export type ExpenseCategory = "equipment" | "travel" | "software" | "supplies" | "other";

export interface Gig {
  id: string;
  title: string;
  clientName: string;
  dateStart: string;
  dateEnd: string;
  location: string;
  amount: number;
  currency: string;
  status: GigStatus;
  paymentStatus: PaymentStatus;
  gigType: GigType;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  category: ExpenseCategory;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  gigCount: number;
  paidCount: number;
  pendingCount: number;
}