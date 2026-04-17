"use client";

import { useEffect, useState } from "react";
import { getComplaints, createComplaint, updateComplaintStatus } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Complaint } from "@/types";

const statusLabel: Record<string, string> = {
  open: "Terbuka",
  in_progress: "Diproses",
  resolved: "Selesai",
};
const statusColor: Record<string, string> = {
  open: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  in_progress: "bg-secondary-container text-on-secondary-container",
  resolved: "bg-green-100 text-green-800",
};

export default function PengaduanPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin_rw" || user?.role === "admin_rt";
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showReply, setShowReply] = useState<Complaint | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [replyForm, setReplyForm] = useState({ status: "in_progress", response: "" });
  const [saving, setSaving] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getComplaints(1, 50, filter);
      setComplaints(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [filter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createComplaint(form);
      setShowCreate(false);
      setForm({ title: "", description: "" });
      fetchComplaints();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReply) return;
    setSaving(true);
    try {
      await updateComplaintStatus(showReply.id, replyForm.status, replyForm.response);
      setShowReply(null);
      fetchComplaints();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Aspirasi Warga</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Pengaduan Warga</h2>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Buat Laporan
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "open", "in_progress", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === s ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {s === "" ? "Semua" : statusLabel[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : complaints.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-4">report</span>
          <p className="text-on-surface-variant">Belum ada pengaduan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-surface-container-lowest rounded-xl p-6 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColor[c.status]}`}>
                      {statusLabel[c.status]}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(c.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h4 className="font-bold text-on-surface mb-1 font-headline">{c.title}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{c.description}</p>
                  {c.response && (
                    <div className="mt-4 p-4 bg-secondary-container/30 rounded-xl">
                      <p className="text-xs font-bold text-on-secondary-container mb-1">Respons Admin:</p>
                      <p className="text-sm text-on-secondary-container">{c.response}</p>
                    </div>
                  )}
                  <p className="text-[10px] text-on-surface-variant mt-2">
                    Pelapor: <span className="font-semibold">{c.user?.name || "—"}</span>
                  </p>
                </div>
                {isAdmin && c.status !== "resolved" && (
                  <button
                    onClick={() => { setShowReply(c); setReplyForm({ status: "in_progress", response: "" }); }}
                    className="px-4 py-2 bg-surface-container-low text-on-surface rounded-xl text-xs font-bold hover:bg-surface-container transition-colors shrink-0 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">reply</span>
                    Respons
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Buat Laporan / Pengaduan</h3>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Judul Laporan</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required placeholder="Ringkasan singkat masalah"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Detail Pengaduan</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5} required placeholder="Jelaskan permasalahan secara rinci..."
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowCreate(false)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm">Batal</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60">
                  {saving ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Respons Pengaduan</h3>
              <button onClick={() => setShowReply(null)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleReply} className="p-6 space-y-4">
              <div className="p-4 bg-surface-container-low rounded-xl">
                <p className="text-xs font-bold text-on-surface-variant mb-1">Pengaduan:</p>
                <p className="text-sm font-semibold text-on-surface">{showReply.title}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</label>
                <select value={replyForm.status} onChange={(e) => setReplyForm({ ...replyForm, status: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                  <option value="in_progress">Sedang Diproses</option>
                  <option value="resolved">Selesai</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Respons / Tanggapan</label>
                <textarea value={replyForm.response} onChange={(e) => setReplyForm({ ...replyForm, response: e.target.value })}
                  rows={4} placeholder="Jelaskan tindakan yang sudah atau akan diambil..."
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowReply(null)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm">Batal</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60">
                  {saving ? "Menyimpan..." : "Kirim Respons"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
