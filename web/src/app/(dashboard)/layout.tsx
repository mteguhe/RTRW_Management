"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { isAuthenticated } from "@/lib/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8">{children}</main>
        <footer className="w-full py-6 bg-slate-50 border-t border-slate-200/30 flex items-center justify-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">
            © 2024 Civic Sanctuary Management. Semua Hak Dilindungi.
          </p>
        </footer>
      </div>
    </div>
  );
}
