import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GigTracker",
  description: "Track your gigs, income, and schedule",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-[#0a0a0a] text-[#fafafa] antialiased">
        <nav className="sticky top-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/90 backdrop-blur-md">
          <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              GigTracker ⚡
            </a>
            <div className="flex gap-5 text-sm">
              <a href="/" className="text-[#a1a1aa] hover:text-white transition">דשבורד</a>
              <a href="/gigs" className="text-[#a1a1aa] hover:text-white transition">גיגים</a>
              <a href="/expenses" className="text-[#a1a1aa] hover:text-white transition">הוצאות</a>
              <a href="/calendar" className="text-[#a1a1aa] hover:text-white transition">לוח שנה</a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}