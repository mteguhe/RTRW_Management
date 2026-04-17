"use client";

import { useEffect, useState } from "react";
import { getRTAccounts, updateUser } from "@/lib/api";
import { User } from "@/types";

export default function AkunRTPage() {
  const [accounts, setAccounts] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [successId, setSuccessId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await getRTAccounts();
      setAccounts(res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const openEdit = (u: User) => {
    setEditTarget(u);
    setForm({ name: u.name, password: "" });
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    setSaving(true);
    setError("");
    try {
      const payload: { name?: string; password?: string } = {};
      if (form.name && form.name !== editTarget.name) payload.name = form.name;
      if (form.password) payload.password = form.password;
      if (Object.keys(payload).length === 0) {
        setError("Tidak ada perubahan yang disimpan.");
        setSaving(false);
        return;
      }
      await updateUser(editTarget.id, payload);
      setSuccessId(editTarget.id);
      setEditTarget(null);
      fetchAccounts();
      setTimeout(() => setSuccessId(null), 3000);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Manajemen Akun</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Akun Pengurus RT</h2>
        <p className="text-on-surface-variant mt-1">Kelola nama dan kata sandi seluruh akun admin RT</p>
      </div>

      {successId && (
        <div className="p-4 bg-green-50 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-green-600 fill-icon">check_circle</span>
          <p className="text-sm font-bold text-green-800">Akun berhasil diperbarui.</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {["No. RT", "Nama Pengurus", "Email", "Aksi"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {accounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-black text-sm">
                        {String(acc.no_rt).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-on-surface">{acc.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs font-mono">{acc.email}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEdit(acc)}
                        className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg text-xs font-bold transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                  {editTarget.no_rt.toString().padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-headline">Edit Akun RT {String(editTarget.no_rt).padStart(3, "0")}</h3>
                  <p className="text-xs text-on-surface-variant">{editTarget.email}</p>
                </div>
              </div>
              <button onClick={() => setEditTarget(null)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-error-container rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-error-container text-sm">error</span>
                  <p className="text-sm text-on-error-container">{error}</p>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nama pengurus RT"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20"
                />
                <p className="text-[11px] text-slate-400">Minimal 6 karakter. Kosongkan jika tidak ingin mengubah kata sandi.</p>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditTarget(null)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? "Menyimpan..." : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
