"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { User } from "@/types";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Sinergi Warga" }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <header className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center w-full px-8 py-4 border-b border-slate-200/30">
      <div className="flex items-center gap-8">
        <div className="text-xl font-bold tracking-tight text-slate-900 font-headline">{title}</div>
        {user && (
          <span className="text-xs font-medium uppercase tracking-widest text-slate-400 hidden lg:block">
            Panel{" "}
            {user.role === "admin_rw"
              ? "Admin RW 017"
              : user.role === "admin_rt"
              ? "Admin RT"
              : "Warga"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1 bg-surface-container-low px-3 py-1.5 rounded-full">
          <span className="material-symbols-outlined text-slate-500 text-lg">notifications</span>
        </button>
        {user && (
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase">
                {user.role === "admin_rw" ? "Ketua RW" : user.role === "admin_rt" ? "Ketua RT" : "Warga"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
