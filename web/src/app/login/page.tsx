"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      const { token, user } = res.data.data;
      saveToken(token);
      saveUser(user);
      router.push("/dashboard");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Login gagal. Periksa email dan kata sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Branding */}
      <section className="hidden md:flex md:w-1/2 lg:w-3/5 bg-surface-container-low relative overflow-hidden flex-col justify-between p-12 lg:p-20">
        <div className="z-10">
          <div className="flex items-center gap-2 mb-12">
            <span className="material-symbols-outlined text-surface-tint text-4xl fill-icon">apartment</span>
            <div>
              <h1 className="text-2xl font-headline font-extrabold text-surface-tint tracking-tighter leading-none">Rusun Cinta Kasih</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tzu Chi · RW 017 · Cengkareng Timur</p>
            </div>
          </div>
          <div className="max-w-lg">
            <h2 className="text-5xl lg:text-6xl font-headline font-extrabold tracking-tight text-on-background leading-tight">
              Hunian Nyaman,{" "}
              <span className="text-surface-tint">Warga Berdaya.</span>
            </h2>
            <p className="mt-6 text-lg text-on-surface-variant font-medium leading-relaxed">
              Platform digital administrasi Rusun Cinta Kasih Tzu Chi — kelola surat, keuangan, dan pengumuman dalam satu sistem terintegrasi.
            </p>
          </div>
        </div>
        <div className="relative mt-auto w-full aspect-video rounded-xl overflow-hidden editorial-shadow">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWVMgpD9pE93A_BOn-Bz0SAEn3JmVMrepnqdYh90RDb_wWa90upISK4xTsumQDY-Md8VZjfed4t8fPj67ODlE__W0AlITfd0EUUBPMbr9X9rfZhl6aW3sB-jeCB1GDBCp2hp108_pD4_AUok-us8L4VhlWuO9Hjpog5Bef4y-toHfODca9kV5PDQ6FjyCZQplWs-mSY-P350o-EFnElDO38a82yXMIMpck-_YZr7zNFfXQMyamZH82fX4QrY-tSQJfPL_y40_NvSZu"
            alt="Komunitas digital"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 backdrop-blur-md bg-white/10 rounded-xl border border-white/10">
            <p className="text-white font-medium italic text-sm">
              &quot;Sistem ini memudahkan urusan warga, dari pengajuan surat hingga laporan keuangan kas RT yang kini jauh lebih terbuka.&quot;
            </p>
            <p className="text-white/80 text-xs mt-2 font-bold">— Ketua RW 017, Rusun Cinta Kasih Tzu Chi</p>
          </div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-surface-tint/5 rounded-full blur-3xl" />
      </section>

      {/* Right: Login Form */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-surface">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center gap-2 mb-12">
            <span className="material-symbols-outlined text-surface-tint text-3xl fill-icon">apartment</span>
            <div>
              <span className="text-xl font-headline font-extrabold text-surface-tint tracking-tighter">Rusun Cinta Kasih</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tzu Chi · RW 017</p>
            </div>
          </div>
          <div className="mb-10">
            <h3 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Selamat Datang</h3>
            <p className="text-on-surface-variant mt-2">Silakan masuk untuk mengakses panel Sinergi Warga.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-container rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-on-error-container text-sm">error</span>
              <p className="text-sm text-on-error-container">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="email">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </span>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contoh@email.com"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-label font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">
                  Kata Sandi
                </label>
                <a href="#" className="text-xs font-semibold text-surface-tint hover:underline transition-all">
                  Lupa Kata Sandi?
                </a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-11 pr-12 py-4 bg-surface-container-low border-none rounded-xl text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-surface-tint/20 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient text-white py-4 px-6 rounded-xl font-headline font-bold text-sm tracking-wide editorial-shadow hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk Ke Dashboard"}
              {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-10 p-6 bg-secondary-container/30 rounded-xl flex items-start gap-4">
            <span className="material-symbols-outlined text-on-secondary-container fill-icon">info</span>
            <div>
              <p className="text-sm font-semibold text-on-secondary-container">Butuh Bantuan?</p>
              <p className="text-xs text-on-secondary-container/80 mt-1 leading-relaxed">
                Hubungi pengurus RT jika Anda belum memiliki akun atau lupa kredensial login Anda.
              </p>
            </div>
          </div>

          <footer className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-on-surface-variant hover:text-surface-tint transition-all group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">keyboard_backspace</span>
              <span className="text-sm font-semibold">Kembali ke Beranda</span>
            </Link>
            <p className="text-xs text-outline font-medium">© 2024 Rusun Cinta Kasih Tzu Chi · RW 017 Cengkareng Timur, Jakarta Barat</p>
          </footer>
        </div>
      </section>
    </main>
  );
}
