"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLetters } from "@/lib/api";
import { Letter } from "@/types";

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

export default function SuratPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    getLetters(1, 50, statusFilter)
      .then((res) => setLetters(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const filterOptions = [
    { value: "", label: "Semua" },
    { value: "pending_rt", label: "Menunggu RT" },
    { value: "pending_rw", label: "Menunggu RW" },
    { value: "done", label: "Selesai" },
    { value: "rejected_rt", label: "Ditolak RT" },
    { value: "rejected_rw", label: "Ditolak RW" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Administrasi Mandiri</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Layanan Surat</h2>
        </div>
        <Link
          href="/surat/ajukan"
          className="px-6 py-3 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Ajukan Surat
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              statusFilter === opt.value
                ? "bg-primary-container text-white"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Letters List */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : letters.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-4">description</span>
          <p className="text-on-surface-variant">Belum ada pengajuan surat</p>
          <Link href="/surat/ajukan" className="inline-flex items-center gap-2 mt-4 text-surface-tint font-bold text-sm hover:underline">
            Ajukan Surat Sekarang
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {letters.map((letter) => (
            <Link
              key={letter.id}
              href={`/surat/${letter.id}`}
              className="block bg-surface-container-lowest p-5 rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-secondary-container">article</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-surface-tint transition-colors">
                      Surat {letter.type === "domisili" ? "Keterangan Domisili" : "Pengantar"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Pemohon: <span className="text-slate-700 font-medium">{letter.resident?.nama || "—"}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(letter.created_at).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={letter.status} />
                  {/* Preview indicator for pending */}
                  {(letter.status === "pending_rt" || letter.status === "pending_rw") && (
                    <span className="flex items-center gap-1 text-xs font-bold text-surface-tint">
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      Pratinjau
                    </span>
                  )}
                  {letter.status === "done" && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <span className="material-symbols-outlined text-sm">download</span>
                      Unduh
                    </span>
                  )}
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>
              {(letter.notes_rt || letter.notes_rw) && (
                <div className="mt-3 pt-3 border-t border-outline-variant/10">
                  {letter.notes_rt && (
                    <p className="text-xs text-slate-500">
                      <span className="font-bold">Catatan RT:</span> {letter.notes_rt}
                    </p>
                  )}
                  {letter.notes_rw && (
                    <p className="text-xs text-slate-500 mt-1">
                      <span className="font-bold">Catatan RW:</span> {letter.notes_rw}
                    </p>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
