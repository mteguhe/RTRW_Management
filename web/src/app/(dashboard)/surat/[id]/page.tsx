"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLetter, approveLetterRT, rejectLetterRT, approveLetterRW, rejectLetterRW } from "@/lib/api";
import { getUser } from "@/lib/auth";
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

function formatTanggal(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function capitalize(str: string) {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
}

export default function PreviewSuratPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = getUser();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getLetter(parseInt(id))
      .then((res) => setLetter(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!letter) return;
    setProcessing(true);
    try {
      if (letter.status === "pending_rt") await approveLetterRT(letter.id, notes);
      else if (letter.status === "pending_rw") await approveLetterRW(letter.id, notes);
      router.push("/surat");
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  const handleReject = async () => {
    if (!letter) return;
    setProcessing(true);
    try {
      if (letter.status === "pending_rt") await rejectLetterRT(letter.id, notes);
      else if (letter.status === "pending_rw") await rejectLetterRW(letter.id, notes);
      setShowRejectModal(false);
      router.push("/surat");
    } catch (e) { console.error(e); }
    finally { setProcessing(false); }
  };

  const isAdminRT = user?.role === "admin_rt";
  const isAdminRW = user?.role === "admin_rw";
  const canApproveRT = isAdminRT && letter?.status === "pending_rt";
  const canApproveRW = isAdminRW && letter?.status === "pending_rw";
  const canAct = canApproveRT || canApproveRW;

  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const suratNomor = letter ? `${letter.id.toString().padStart(3, "0")}/SP/RW017/${new Date(letter.created_at).getFullYear()}` : "—";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-on-surface-variant">Memuat data surat...</div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant">description_off</span>
        <p className="text-on-surface-variant">Surat tidak ditemukan</p>
        <button onClick={() => router.back()} className="text-surface-tint font-bold text-sm hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="no-print flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">keyboard_backspace</span>
            <span className="text-sm font-semibold">Kembali</span>
          </button>
          <div className="h-5 w-px bg-outline-variant/30" />
          <div>
            <p className="text-xs font-bold text-surface-tint uppercase tracking-widest">Pratinjau Dokumen</p>
            <h2 className="text-xl font-extrabold tracking-tight text-on-surface font-headline">
              Surat {letter.type === "domisili" ? "Keterangan Domisili" : "Pengantar"}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={letter.status} />
        </div>
      </div>

      {/* Admin Action Bar */}
      {canAct && (
        <div className="no-print mb-6 p-5 bg-tertiary-fixed/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-on-tertiary-fixed-variant fill-icon">pending_actions</span>
            <div>
              <p className="font-bold text-on-tertiary-fixed-variant text-sm">
                Menunggu persetujuan {canApproveRT ? "Admin RT" : "Admin RW"}
              </p>
              <p className="text-xs text-on-tertiary-fixed-variant/70">
                Periksa data warga dengan teliti sebelum menyetujui
              </p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={processing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-error/30 text-error rounded-xl font-bold text-sm hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Tolak
            </button>
            <button
              onClick={handleApprove}
              disabled={processing}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-green-200"
            >
              <span className="material-symbols-outlined text-[18px] fill-icon">check_circle</span>
              {processing ? "Memproses..." : "Setujui"}
            </button>
          </div>
        </div>
      )}

      {/* Notes if rejected/approved with notes */}
      {(letter.notes_rt || letter.notes_rw) && (
        <div className="no-print mb-6 p-5 bg-surface-container-low rounded-xl space-y-2">
          {letter.notes_rt && (
            <p className="text-sm text-on-surface-variant">
              <span className="font-bold text-on-surface">Catatan RT:</span> {letter.notes_rt}
            </p>
          )}
          {letter.notes_rw && (
            <p className="text-sm text-on-surface-variant">
              <span className="font-bold text-on-surface">Catatan RW:</span> {letter.notes_rw}
            </p>
          )}
        </div>
      )}

      {/* Document Preview — A4 style */}
      <div className="bg-white shadow-sm border border-outline-variant/10 w-full max-w-[210mm] mx-auto p-[15mm] min-h-[297mm] flex flex-col print:shadow-none print:border-none print:p-0">

        {/* Document Header */}
        <div className="flex items-center gap-6 border-b-2 border-black pb-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-container fill-icon" style={{ fontSize: "48px" }}>account_balance</span>
          </div>
          <div>
            <h1 className="font-headline text-lg font-extrabold uppercase tracking-widest text-black">
              Pemerintah Kota Administrasi Jakarta Barat
            </h1>
            <h2 className="font-headline text-base font-bold uppercase text-black">Kecamatan Cengkareng</h2>
            <h3 className="font-headline text-sm font-bold uppercase text-black">Kelurahan Cengkareng Timur</h3>
            <p className="text-sm mt-1">Rukun Warga 017 — Jl. Daan Mogot KM 16, Rusun Cinta Kasih Tzu Chi</p>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center mb-10">
          <h4 className="font-headline text-2xl font-black uppercase tracking-[0.2em] underline decoration-2 underline-offset-8">
            Surat {letter.type === "domisili" ? "Keterangan Domisili" : "Pengantar"}
          </h4>
          <p className="text-sm mt-4 font-medium italic">Nomor: {suratNomor}</p>
        </div>

        {/* Document Body */}
        <div className="flex-1">
          <p className="text-base mb-6 leading-relaxed">
            Yang bertanda tangan di bawah ini Ketua RW 017 Kelurahan Cengkareng Timur, Kecamatan Cengkareng, Kota Administrasi Jakarta Barat, dengan ini menerangkan bahwa:
          </p>

          {/* Citizen Data Table */}
          <div className="mb-8 space-y-3">
            {[
              { label: "Nama Lengkap", value: letter.resident?.nama?.toUpperCase() || "—" },
              { label: "NIK", value: letter.resident?.nik || "—" },
              { label: "No. Kartu Keluarga", value: letter.resident?.no_kk || "—" },
              {
                label: "Tempat, Tanggal Lahir",
                value: `${letter.resident?.tempat_lahir || "—"}, ${formatTanggal(letter.resident?.tanggal_lahir)}`,
              },
              { label: "Jenis Kelamin", value: capitalize(letter.resident?.jenis_kelamin) },
              { label: "Agama", value: capitalize(letter.resident?.agama) },
              { label: "Status Pernikahan", value: capitalize(letter.resident?.status_pernikahan) },
              { label: "Blok / Unit", value: letter.resident?.blok || "—" },
              {
                label: "Alamat",
                value: `${letter.resident?.alamat || "—"}, RT ${letter.resident?.no_rt || "—"} RW 017, Kel. Cengkareng Timur`,
              },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-12 gap-2">
                <div className="col-span-4 font-semibold text-sm">{row.label}</div>
                <div className="col-span-1 text-center text-sm">:</div>
                <div className="col-span-7 text-sm font-bold">{row.value}</div>
              </div>
            ))}
          </div>

          {/* Purpose Section */}
          <div className="bg-slate-50/80 p-6 rounded-lg mb-8 border border-slate-200/40">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Keperluan Surat:</p>
            <p className="text-base font-semibold text-black leading-relaxed">
              {letter.purpose || "—"}
            </p>
          </div>

          <p className="text-base leading-relaxed">
            Demikian surat ini diberikan kepada yang bersangkutan untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerjasamanya kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signature Footer */}
        <div className="mt-12">
          <div className="flex justify-end mb-8">
            <p className="text-base">Jakarta, {today}</p>
          </div>
          <div className="grid grid-cols-2 gap-12 text-center">
            <div className="relative py-4">
              <p className="font-bold mb-20 uppercase tracking-tighter text-sm">
                Mengetahui,<br />Ketua RW 017<br />Cengkareng Timur
              </p>
              <div className="relative inline-block">
                <div className="absolute -top-16 -left-8 opacity-10 transform -rotate-12 pointer-events-none">
                  <span className="material-symbols-outlined text-blue-800 fill-icon" style={{ fontSize: "100px" }}>verified</span>
                </div>
                <p className="font-headline font-extrabold uppercase border-b border-black inline-block px-2 text-sm">
                  Bpk. H. Sudirman
                </p>
              </div>
            </div>
            <div className="relative py-4">
              <p className="font-bold mb-20 uppercase tracking-tighter text-sm">
                Hormat Kami,<br />Ketua RT {letter.resident?.no_rt || "—"}
              </p>
              <div className="relative inline-block">
                <div className="absolute -top-16 -left-8 opacity-10 transform rotate-6 pointer-events-none">
                  <span className="material-symbols-outlined text-blue-800 fill-icon" style={{ fontSize: "100px" }}>verified_user</span>
                </div>
                <p className="font-headline font-extrabold uppercase border-b border-black inline-block px-2 text-sm">
                  Admin RT
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="no-print fixed bottom-8 right-8 flex flex-col gap-3">
        {letter.status === "done" && letter.file_url && (
          <a
            href={letter.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-surface-tint text-white px-6 py-4 rounded-full font-headline font-bold shadow-xl hover:opacity-90 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">download</span>
            Unduh Surat
          </a>
        )}
        <button
          onClick={() => window.print()}
          className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full font-headline font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">print</span>
          Cetak Dokumen
        </button>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-error-container">close</span>
                </div>
                <h3 className="text-lg font-bold font-headline">Tolak Pengajuan</h3>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-on-surface-variant">
                Berikan alasan penolakan agar warga dapat memperbaiki pengajuannya.
              </p>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Alasan Penolakan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Contoh: Data NIK tidak sesuai dengan KTP yang terdaftar..."
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-error/20"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-6 py-3 bg-error text-white rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                >
                  {processing ? "Memproses..." : "Konfirmasi Tolak"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}
