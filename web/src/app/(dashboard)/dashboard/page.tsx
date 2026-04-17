"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats, getLetters, getAnnouncements } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { DashboardStats, Letter, Announcement } from "@/types";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending_rt: { label: "Menunggu RT", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
    pending_rw: { label: "Menunggu RW", cls: "bg-tertiary-fixed text-on-tertiary-fixed-variant" },
    approved_rt: { label: "Disetujui RT", cls: "bg-secondary-container text-on-secondary-container" },
    approved_rw: { label: "Disetujui RW", cls: "bg-secondary-container text-on-secondary-container" },
    rejected_rt: { label: "Ditolak RT", cls: "bg-error-container text-on-error-container" },
    rejected_rw: { label: "Ditolak RW", cls: "bg-error-container text-on-error-container" },
    done: { label: "Selesai", cls: "bg-green-100 text-green-800" },
  };
  const s = map[status] || { label: status, cls: "bg-surface-container text-on-surface" };
  return (
    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const user = getUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, lettersRes, announcementsRes] = await Promise.all([
          getStats(),
          getLetters(1, 5),
          getAnnouncements(1, 3),
        ]);
        setStats(statsRes.data.data);
        setLetters(lettersRes.data.data || []);
        setAnnouncements(announcementsRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-on-surface-variant">Memuat data...</div>
      </div>
    );
  }

  const isAdmin = user?.role === "admin_rw" || user?.role === "admin_rt";

  return (
    <div className="space-y-8">
      {/* Community Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-highest rounded-xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[200px]">
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-primary-container uppercase mb-4">
              Selamat Datang
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-container leading-tight max-w-xl font-headline">
              Halo, <span className="text-surface-tint">{user?.name || "Warga"}</span>
            </h2>
            <p className="mt-2 text-slate-600">
              {user?.role === "admin_rw" ? "Panel Admin RW 008" : user?.role === "admin_rt" ? "Panel Admin RT" : "Portal Warga"}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-6 relative z-10">
            <Link href="/surat/ajukan" className="px-6 py-2.5 bg-primary-container text-white rounded-full text-sm font-bold">
              Ajukan Surat
            </Link>
            <Link href="/pengumuman" className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
              <span className="material-symbols-outlined text-sm">campaign</span>
              Lihat Pengumuman
            </Link>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary-container/5 rounded-full" />
          <div className="absolute right-12 top-4 w-32 h-32 bg-surface-tint/5 rounded-full" />
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-slate-50 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-blue-700 text-3xl">groups</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Warga Aktif</p>
          <h3 className="text-5xl font-black text-slate-900 my-2 font-headline">
            {stats?.total_warga?.toLocaleString("id-ID") || "—"}
          </h3>
          <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12 bulan ini</span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Warga",
            value: stats?.total_warga?.toLocaleString("id-ID") || "—",
            icon: "group",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Surat Pending",
            value: String(stats?.pending_surat || 0),
            icon: "description",
            color: "text-orange-600",
            bg: "bg-orange-50",
          },
          {
            label: "Saldo Kas RT",
            value: stats?.kas_rt ? formatRupiah(stats.kas_rt.balance) : "—",
            icon: "account_balance_wallet",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Saldo Kas RW",
            value: stats?.kas_rw ? formatRupiah(stats.kas_rw.balance) : "—",
            icon: "savings",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((card) => (
          <div key={card.label} className="bg-surface-container-lowest rounded-xl p-6 border border-slate-50">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{card.label}</p>
              <div className={`w-10 h-10 rounded-full ${card.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
              </div>
            </div>
            <h4 className="text-2xl font-black text-slate-900 font-headline">{card.value}</h4>
          </div>
        ))}
      </section>

      {/* Letters & Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-6">
            <h3 className="text-2xl font-extrabold tracking-tight font-headline">
              {isAdmin ? "Antrian Surat Masuk" : "Status Surat Saya"}
            </h3>
            <Link href="/surat" className="text-xs font-bold text-surface-tint uppercase hover:underline">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-4">
            {letters.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center text-on-surface-variant">
                Belum ada pengajuan surat
              </div>
            ) : (
              letters.map((letter) => (
                <div key={letter.id} className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">article</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Surat {letter.type === "domisili" ? "Domisili" : "Pengantar"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {letter.resident?.nama || "—"} · {new Date(letter.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={letter.status} />
                    {isAdmin && (letter.status === "pending_rt" || letter.status === "pending_rw") && (
                      <div className="flex gap-1">
                        <Link
                          href={`/surat/${letter.id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined fill-icon">check_circle</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-extrabold tracking-tight mb-6 font-headline">Pengumuman Terbaru</h3>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-on-surface-variant text-sm">
                Belum ada pengumuman
              </div>
            ) : (
              announcements.map((ann) => {
                const catColor: Record<string, string> = {
                  umum: "text-surface-tint",
                  darurat: "text-error",
                  kegiatan: "text-on-tertiary-container",
                };
                return (
                  <div key={ann.id} className="bg-surface-container-low p-5 rounded-xl hover:bg-surface-container transition-colors">
                    <span className={`text-[10px] font-bold uppercase ${catColor[ann.category] || "text-surface-tint"} mb-2 block`}>
                      {ann.category}
                    </span>
                    <h4 className="text-sm font-bold text-on-surface mb-1 font-headline">{ann.title}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{ann.content}</p>
                  </div>
                );
              })
            )}
            <Link href="/pengumuman" className="text-xs font-bold text-surface-tint uppercase flex items-center gap-1 hover:underline">
              Lihat Semua Pengumuman
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
