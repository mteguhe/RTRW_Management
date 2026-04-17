"use client";

import { useEffect, useState } from "react";
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Announcement } from "@/types";

const catLabel: Record<string, string> = { umum: "Umum", darurat: "Darurat", kegiatan: "Kegiatan" };
const catColor: Record<string, string> = {
  umum: "bg-secondary-container text-on-secondary-container",
  darurat: "bg-error-container text-on-error-container",
  kegiatan: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

export default function PengumumanPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin_rw" || user?.role === "admin_rt";
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "umum" });
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await getAnnouncements(1, 50, filter);
      setAnnouncements(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", content: "", category: "umum" });
    setShowModal(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, content: a.content, category: a.category });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await updateAnnouncement(editing.id, form);
      else await createAnnouncement(form);
      setShowModal(false);
      fetchAnnouncements();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Warta Digital</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Pengumuman &amp; Informasi</h2>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-6 py-3 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Buat Pengumuman
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["", "umum", "darurat", "kegiatan"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              filter === cat ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {cat === "" ? "Semua" : catLabel[cat]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : announcements.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-4">campaign</span>
          <p className="text-on-surface-variant">Belum ada pengumuman</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-surface-container-lowest rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${catColor[ann.category] || ""}`}>
                  {catLabel[ann.category] || ann.category}
                </span>
                {isAdmin && (
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(ann)} className="p-1.5 text-surface-tint hover:bg-blue-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1.5 text-error hover:bg-red-50 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-headline">{ann.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">{ann.content}</p>
              <div className="mt-4 pt-4 border-t border-outline-variant/10 flex items-center justify-between text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">person</span>
                  {ann.author?.name || "Admin"}
                </span>
                <span>{ann.published_at ? new Date(ann.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">{editing ? "Edit Pengumuman" : "Buat Pengumuman Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                  <option value="umum">Umum</option>
                  <option value="darurat">Darurat</option>
                  <option value="kegiatan">Kegiatan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Judul</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Isi Pengumuman</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5} required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm">Batal</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60">
                  {saving ? "Menyimpan..." : editing ? "Simpan" : "Publikasikan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
