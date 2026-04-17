"use client";

import { useEffect, useState } from "react";
import { getResidents, createResident, updateResident, deleteResident } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Resident } from "@/types";

const BLOK_OPTIONS = [
  ...Array.from({ length: 18 }, (_, i) => `A${i + 1}`),
  ...Array.from({ length: 38 }, (_, i) => `B${i + 1}`),
  "Pujasera",
];

const RT_OPTIONS = Array.from({ length: 18 }, (_, i) => i + 1);

const emptyForm = {
  nik: "", no_kk: "", nama: "", alamat: "", blok: "", lantai: "",
  no_rt: "1",
  status_pernikahan: "lajang", agama: "islam", tempat_lahir: "",
  tanggal_lahir: "", jenis_kelamin: "pria", status_warga: "aktif",
};

export default function WargaPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin_rw" || user?.role === "admin_rt";
  const [residents, setResidents] = useState<Resident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resident | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const limit = 20;

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const res = await getResidents(page, limit, search);
      setResidents(res.data.data || []);
      setTotal(res.data.meta?.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResidents(); }, [page, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (r: Resident) => {
    setEditing(r);
    setForm({
      nik: r.nik, no_kk: r.no_kk, nama: r.nama, alamat: r.alamat,
      blok: r.blok, lantai: r.lantai || "", no_rt: String(r.no_rt || 1),
      status_pernikahan: r.status_pernikahan,
      agama: r.agama, tempat_lahir: r.tempat_lahir, tanggal_lahir: r.tanggal_lahir,
      jenis_kelamin: r.jenis_kelamin, status_warga: r.status_warga,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus data warga ini?")) return;
    try {
      await deleteResident(id);
      fetchResidents();
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, no_rt: parseInt(form.no_rt) };
      if (editing) await updateResident(editing.id, payload);
      else await createResident(payload);
      setShowModal(false);
      fetchResidents();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Manajemen Data</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Data Warga</h2>
          <p className="text-on-surface-variant mt-1">Total {total.toLocaleString("id-ID")} warga terdaftar</p>
        </div>
        {isAdmin && (
          <button
            onClick={openCreate}
            className="px-6 py-3 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Tambah Warga
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </span>
        <input
          type="text"
          placeholder="Cari nama, NIK, atau No. KK..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-surface-tint/20 outline-none"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : residents.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-4">group</span>
          <p className="text-on-surface-variant">Tidak ada data warga ditemukan</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {["Nama", "RT", "NIK", "No. KK", "Blok", "Status", "Aksi"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {residents.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs shrink-0">
                          {r.nama.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{r.nama}</p>
                          <p className="text-[10px] text-on-surface-variant capitalize">{r.jenis_kelamin} · {r.agama}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary-container/20 text-primary-container rounded-lg text-xs font-bold">
                        RT {r.no_rt || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{r.nik}</td>
                    <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{r.no_kk}</td>
                    <td className="px-6 py-4">
                      {r.blok ? <span className="px-2 py-1 bg-surface-container rounded text-xs font-bold">{r.blok}</span> : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        r.status_warga === "aktif" ? "bg-green-100 text-green-800" : "bg-surface-container text-on-surface-variant"
                      }`}>
                        {r.status_warga}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(r)}
                            className="p-2 text-surface-tint hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">Menampilkan {residents.length} dari {total} warga</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs font-bold disabled:opacity-50 hover:bg-surface-container transition-colors"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={residents.length < limit}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-xs font-bold disabled:opacity-50 hover:bg-surface-container transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">{editing ? "Edit Data Warga" : "Tambah Warga Baru"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "nama", label: "Nama Lengkap", type: "text" },
                  { key: "nik", label: "NIK (16 digit)", type: "text" },
                  { key: "no_kk", label: "Nomor KK", type: "text" },
                  { key: "tempat_lahir", label: "Tempat Lahir", type: "text" },
                  { key: "tanggal_lahir", label: "Tanggal Lahir", type: "date" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
                    <input
                      type={type}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20"
                      required
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nomor RT</label>
                  <select value={form.no_rt} onChange={(e) => setForm({ ...form, no_rt: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none" required>
                    {RT_OPTIONS.map(rt => <option key={rt} value={rt}>RT {rt}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Blok / Unit</label>
                  <select value={form.blok} onChange={(e) => setForm({ ...form, blok: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none" required>
                    <option value="">-- Pilih Blok --</option>
                    {BLOK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Jenis Kelamin</label>
                  <select value={form.jenis_kelamin} onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                    <option value="pria">Pria</option>
                    <option value="wanita">Wanita</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Agama</label>
                  <select value={form.agama} onChange={(e) => setForm({ ...form, agama: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                    {["islam","kristen","katolik","hindu","budha","other"].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status Pernikahan</label>
                  <select value={form.status_pernikahan} onChange={(e) => setForm({ ...form, status_pernikahan: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                    <option value="lajang">Lajang</option>
                    <option value="kawin">Kawin</option>
                    <option value="cerai_hidup">Cerai Hidup</option>
                    <option value="cerai_mati">Cerai Mati</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status Warga</label>
                  <select value={form.status_warga} onChange={(e) => setForm({ ...form, status_warga: e.target.value })}
                    className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                    <option value="aktif">Aktif</option>
                    <option value="tidak_aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Alamat Lengkap</label>
                <textarea value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  rows={2} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60">
                  {saving ? "Menyimpan..." : editing ? "Simpan Perubahan" : "Tambah Warga"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
