"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createLetter, getResidents } from "@/lib/api";
import { Resident } from "@/types";

export default function AjukanSuratPage() {
  const router = useRouter();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [form, setForm] = useState({
    resident_id: "",
    type: "domisili",
    purpose: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getResidents(1, 100)
      .then((res) => setResidents(res.data.data || []))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.resident_id) {
      setError("Pilih data warga terlebih dahulu.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await createLetter({ ...form, resident_id: parseInt(form.resident_id) });
      setSuccess(true);
      setTimeout(() => router.push("/surat"), 2000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Gagal mengajukan surat. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-bold text-on-primary-fixed-variant uppercase tracking-[0.2em]">Administrasi Mandiri</span>
        <h2 className="text-4xl font-extrabold tracking-tight mt-2 text-on-surface font-headline">Formulir Pengajuan Surat</h2>
        <p className="mt-4 text-on-surface-variant max-w-2xl leading-relaxed">
          Silakan lengkapi formulir di bawah ini untuk mengajukan surat keterangan resmi. Tim administrasi kami akan meninjau permohonan Anda dalam waktu 1-2 hari kerja.
        </p>
      </div>

      {success && (
        <div className="p-6 bg-green-50 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-green-600 fill-icon">check_circle</span>
          <div>
            <p className="font-bold text-green-800">Surat berhasil diajukan!</p>
            <p className="text-sm text-green-600">Anda akan dialihkan ke halaman surat...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-error-container rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-on-error-container">error</span>
          <p className="text-sm text-on-error-container">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Klasifikasi */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline">
              <span className="material-symbols-outlined text-blue-600">fact_check</span>
              Klasifikasi Pengajuan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Jenis Surat</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-surface-tint/20 outline-none appearance-none cursor-pointer"
                >
                  <option value="domisili">Surat Keterangan Domisili</option>
                  <option value="pengantar">Surat Pengantar (Umum)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Data Warga</label>
                <select
                  value={form.resident_id}
                  onChange={(e) => setForm({ ...form, resident_id: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-surface-tint/20 outline-none appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- Pilih Warga --</option>
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>{r.nama} — {r.nik}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Detail Keperluan */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline">
              <span className="material-symbols-outlined text-blue-600">edit_note</span>
              Detail Keperluan
            </h3>
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Tujuan &amp; Keperluan Surat</label>
              <textarea
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                placeholder="Contoh: Digunakan sebagai syarat pembuatan rekening bank atau melamar pekerjaan..."
                rows={4}
                required
                className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-surface-tint/20 outline-none transition-all"
              />
              <p className="text-[10px] text-slate-400 italic mt-2">Sebutkan secara spesifik agar proses verifikasi lebih cepat.</p>
            </div>
          </div>

          {/* Upload (visual only) */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 font-headline">
              <span className="material-symbols-outlined text-blue-600">cloud_upload</span>
              Dokumen Pendukung
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">add_a_photo</span>
                </div>
                <span className="text-sm font-bold text-slate-900">Unggah KTP</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">JPG, PNG, PDF (Maks 2MB)</span>
              </div>
              <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/30 transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <span className="text-sm font-bold text-slate-900">Unggah Kartu Keluarga</span>
                <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Diperlukan untuk Domisili</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-primary-container text-white rounded-xl p-8 relative overflow-hidden sticky top-24">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold font-headline mb-4 relative z-10">Ringkasan Pengajuan</h3>
            <div className="space-y-6 relative z-10">
              {[
                { icon: "schedule", label: "Estimasi Selesai", value: "24 - 48 Jam Kerja" },
                { icon: "verified", label: "Metode Verifikasi", value: "Validasi NIK & TTD Ketua RT" },
                { icon: "smartphone", label: "Notifikasi", value: "Status Real-time" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-4 bg-white text-primary-container rounded-xl font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all shadow-xl shadow-black/20 disabled:opacity-60"
              >
                {loading ? "Mengajukan..." : success ? "Berhasil!" : "Ajukan Sekarang"}
              </button>
              <p className="text-[10px] text-center mt-4 opacity-50 uppercase tracking-widest font-medium">
                Dengan menekan tombol, Anda menyetujui syarat &amp; ketentuan pengolahan data.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Butuh Bantuan?</h4>
            <div className="flex items-center gap-4 p-3 bg-white rounded-xl mb-3">
              <span className="material-symbols-outlined text-blue-600">call</span>
              <div>
                <p className="text-xs font-bold">Hubungi Sekretariat</p>
                <p className="text-[10px] text-slate-500">0812-3456-7890 (RT 04)</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
