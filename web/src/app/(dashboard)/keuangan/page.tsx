"use client";

import { useEffect, useState } from "react";
import { getFinances, getFinanceSummary, createFinance } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { Finance, FinanceSummary } from "@/types";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function KeuanganPage() {
  const user = getUser();
  const isAdmin = user?.role === "admin_rw" || user?.role === "admin_rt";
  const [scope, setScope] = useState<"rt" | "rw">("rt");
  const [finances, setFinances] = useState<Finance[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ scope: "rt", type: "income", amount: "", description: "", date: "" });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [finRes, sumRes] = await Promise.all([
        getFinances(1, 50, scope),
        getFinanceSummary(scope),
      ]);
      setFinances(finRes.data.data || []);
      setSummary(sumRes.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [scope]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createFinance({ ...form, amount: parseFloat(form.amount) });
      setShowModal(false);
      setForm({ scope: "rt", type: "income", amount: "", description: "", date: "" });
      fetchData();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-surface-tint uppercase tracking-widest mb-1">Transparansi Keuangan</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface font-headline">Laporan Keuangan</h2>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Catat Transaksi
          </button>
        )}
      </div>

      {/* Scope Tabs */}
      <div className="flex gap-2">
        {(["rt", "rw"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              scope === s ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            Kas {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Pemasukan</p>
            <h4 className="text-2xl font-black text-green-700 font-headline">{formatRupiah(summary.total_income)}</h4>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Total Pengeluaran</p>
            <h4 className="text-2xl font-black text-error font-headline">{formatRupiah(summary.total_expense)}</h4>
          </div>
          <div className="bg-primary-container rounded-xl p-6 text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Saldo Akhir</p>
            <h4 className="text-2xl font-black font-headline">{formatRupiah(summary.balance)}</h4>
          </div>
        </div>
      )}

      {/* Transactions */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-on-surface-variant">Memuat data...</div>
      ) : finances.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant block mb-4">payments</span>
          <p className="text-on-surface-variant">Belum ada transaksi tercatat</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low">
                <tr>
                  {["Tanggal", "Deskripsi", "Jenis", "Jumlah", "Dicatat oleh"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {finances.map((f) => (
                  <tr key={f.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 text-on-surface-variant text-xs">
                      {new Date(f.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-on-surface">{f.description || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        f.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {f.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 font-bold font-headline ${f.type === "income" ? "text-green-700" : "text-error"}`}>
                      {f.type === "income" ? "+" : "-"}{formatRupiah(f.amount)}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant text-xs">{f.creator?.name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline">Catat Transaksi</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Kas</label>
                <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                  <option value="rt">Kas RT</option>
                  <option value="rw">Kas RW</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Jenis</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none appearance-none">
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Jumlah (Rp)</label>
                <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tanggal</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Keterangan</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-surface-tint/20" />
              </div>
              <div className="pt-2 flex gap-3 justify-end">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-surface-container-low text-on-surface rounded-xl font-bold text-sm">Batal</button>
                <button type="submit" disabled={saving}
                  className="px-6 py-3 btn-gradient text-white rounded-xl font-bold text-sm disabled:opacity-60">
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
