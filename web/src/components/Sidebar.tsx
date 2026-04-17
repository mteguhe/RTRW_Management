"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, getUser } from "@/lib/auth";
import { User } from "@/types";

const navItems = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/warga", icon: "group", label: "Warga" },
  { href: "/surat", icon: "description", label: "Surat" },
  { href: "/keuangan", icon: "payments", label: "Keuangan" },
  { href: "/pengumuman", icon: "campaign", label: "Pengumuman" },
  { href: "/pengaduan", icon: "report", label: "Pengaduan" },
];

const adminRWItems = [
  { href: "/akun-rt", icon: "manage_accounts", label: "Akun RT" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50 bg-white border-r border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white fill-icon">shield</span>
          </div>
          <div>
            <h1 className="text-base font-black tracking-tighter text-blue-800 font-headline">Rusun Cinta Kasih</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">RW 017 · Cengkareng Timur</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-4 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 mx-2 my-1 px-4 py-3 rounded-lg transition-all group ${
                active
                  ? "bg-blue-50 text-blue-700 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          );
        })}
        {user?.role === "admin_rw" && (
          <>
            <div className="mx-4 my-3 border-t border-slate-100" />
            <p className="mx-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Manajemen</p>
            {adminRWItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 mx-2 my-1 px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </>
        )}
      </nav>

      <div className="p-4">
        <Link
          href="/surat/ajukan"
          className="w-full py-3 px-4 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Ajukan Surat
        </Link>
      </div>

      <div className="border-t border-slate-100 p-2">
        {user && (
          <div className="px-4 py-3 mb-2">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-[10px] text-blue-600 uppercase font-bold tracking-wide">
              {user.role === "admin_rw" ? "Admin RW" : user.role === "admin_rt" ? "Admin RT" : "Warga"}
            </p>
          </div>
        )}
        <a href="#" className="text-slate-600 px-4 py-3 flex items-center gap-3 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
          <span className="material-symbols-outlined">help</span>
          <span className="text-sm font-semibold">Bantuan</span>
        </a>
        <button
          onClick={logout}
          className="w-full text-left text-slate-600 px-4 py-3 flex items-center gap-3 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-semibold">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
