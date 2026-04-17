"use client";

import Link from "next/link";

const PROFILE = {
  nama: "Rusun Cinta Kasih Tzu Chi",
  rw: "RW 017",
  kelurahan: "Cengkareng Timur",
  kecamatan: "Cengkareng",
  kota: "Jakarta Barat",
  provinsi: "DKI Jakarta",
  alamat: "Jl. Daan Mogot KM 16, Cengkareng Timur",
  email: "rw017.cintakasih@gmail.com",
  tagline: "Hunian Nyaman, Warga Berdaya, Lingkungan Harmonis",
  deskripsi:
    "Rusun Cinta Kasih Tzu Chi adalah hunian vertikal yang dikelola secara gotong royong oleh warga RW 017 Cengkareng Timur. Platform ini hadir untuk mewujudkan transparansi administrasi dan kemudahan layanan warga secara digital.",
};

export default function LandingPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white fill-icon text-xl">apartment</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-blue-800 tracking-tighter font-headline leading-none">
                Cinta Kasih Tzu Chi
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {PROFILE.rw} · {PROFILE.kelurahan}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-blue-700 font-bold border-b-2 border-blue-700 pb-1 font-headline tracking-tight">Beranda</a>
            <a href="#kegiatan" className="text-slate-600 hover:text-blue-600 transition-colors font-headline font-bold">Kegiatan</a>
            <a href="#pengumuman" className="text-slate-600 hover:text-blue-600 transition-colors font-headline font-bold">Pengumuman</a>
            <a href="#profil" className="text-slate-600 hover:text-blue-600 transition-colors font-headline font-bold">Profil</a>
          </div>
          <Link
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-md text-sm font-semibold hover:opacity-80 transition-all active:scale-95"
          >
            Masuk
          </Link>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-6">
                {PROFILE.rw} · {PROFILE.kelurahan} · {PROFILE.kota}
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.1] mb-6 font-headline">
                {PROFILE.nama}
              </h1>
              <p className="text-xl text-surface-tint font-bold mb-4 font-headline italic">
                &ldquo;{PROFILE.tagline}&rdquo;
              </p>
              <p className="text-lg text-on-surface-variant mb-10 max-w-xl leading-relaxed">
                {PROFILE.deskripsi}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="px-8 py-4 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-md font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-transform active:scale-95"
                >
                  Masuk ke Portal Warga
                </Link>
                <a
                  href="#profil"
                  className="px-8 py-4 bg-transparent border border-outline-variant/20 text-on-surface rounded-md font-bold hover:bg-surface-container-low transition-colors"
                >
                  Profil Rusun
                </a>
              </div>
            </div>

            {/* Visual Card */}
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl" />
              <div className="relative rounded-2xl overflow-hidden bg-primary-container p-8 text-white editorial-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <span className="material-symbols-outlined fill-icon text-4xl">apartment</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black font-headline">Rusun Cinta Kasih</h3>
                    <p className="text-white/70 text-sm">Tzu Chi Foundation</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: "location_on", label: "Alamat", value: PROFILE.alamat },
                    { icon: "holiday_village", label: "Wilayah", value: `${PROFILE.rw}, Kel. ${PROFILE.kelurahan}` },
                    { icon: "location_city", label: "Kota", value: `${PROFILE.kecamatan}, ${PROFILE.kota}` },
                    { icon: "mail", label: "Email", value: PROFILE.email },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-white/60 text-lg shrink-0 mt-0.5">{item.icon}</span>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{item.label}</p>
                        <p className="text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Decorative */}
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none select-none">
                  <span className="text-[160px] font-black leading-none font-headline">017</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-primary-container">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: "20", label: "Lantai Hunian" },
              { value: "520", label: "Unit Apartemen" },
              { value: "4", label: "Blok Tower" },
              { value: "24 Jam", label: "Layanan Digital" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black font-headline mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Layanan */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold text-surface-tint uppercase tracking-widest mb-2">Platform Digital</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Layanan Warga Online</h2>
              <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto">
                Semua urusan administrasi Rusun Cinta Kasih Tzu Chi kini dapat dilakukan secara digital, kapan saja dan di mana saja.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "description",
                  bg: "bg-secondary-container",
                  iconColor: "text-on-secondary-container",
                  title: "Pengajuan Surat",
                  desc: "Ajukan surat domisili, surat pengantar, dan dokumen keterangan lainnya secara online tanpa antri.",
                },
                {
                  icon: "payments",
                  bg: "bg-tertiary-fixed",
                  iconColor: "text-on-tertiary-fixed-variant",
                  title: "Transparansi Keuangan",
                  desc: "Pantau laporan kas RW secara real-time. Setiap rupiah tercatat dan dapat diakses seluruh warga.",
                },
                {
                  icon: "campaign",
                  bg: "bg-secondary-fixed",
                  iconColor: "text-on-secondary-fixed-variant",
                  title: "Informasi & Pengumuman",
                  desc: "Dapatkan update terbaru kegiatan rusun, jadwal rapat, dan pengumuman penting dari pengurus.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                  <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-6`}>
                    <span className={`material-symbols-outlined ${item.iconColor}`}>{item.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-headline">{item.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed flex-grow">{item.desc}</p>
                  <Link href="/login" className="mt-6 text-surface-tint font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Gunakan Layanan
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kegiatan */}
        <section id="kegiatan" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <p className="text-sm font-bold text-surface-tint uppercase tracking-widest mb-2">Agenda Rusun</p>
                <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Kegiatan Mendatang</h2>
              </div>
              <Link href="/login" className="text-surface-tint font-bold flex items-center gap-2 group">
                Lihat Semua
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "cleaning_services",
                  bg: "bg-secondary-container",
                  color: "text-on-secondary-container",
                  title: "Kerja Bakti Bersama",
                  desc: "Pembersihan area koridor, tangga darurat, dan taman rusun bersama seluruh warga.",
                  date: "Minggu, 27 Apr 2025",
                  lokasi: "Seluruh Blok Tower",
                },
                {
                  icon: "groups",
                  bg: "bg-tertiary-fixed",
                  color: "text-on-tertiary-fixed-variant",
                  title: "Rapat Bulanan RW 017",
                  desc: "Pembahasan anggaran keamanan, iuran, dan rencana perbaikan fasilitas lift.",
                  date: "Sabtu, 3 Mei 2025",
                  lokasi: "Ruang Serbaguna Lt. 1",
                },
                {
                  icon: "child_care",
                  bg: "bg-secondary-fixed",
                  color: "text-on-secondary-fixed-variant",
                  title: "Posyandu Balita",
                  desc: "Pemeriksaan rutin kesehatan balita dan pembagian vitamin bagi anak-anak warga rusun.",
                  date: "Selasa, 6 Mei 2025",
                  lokasi: "Klinik Tzu Chi Lt. 2",
                },
              ].map((ev) => (
                <div key={ev.title} className="bg-surface-container-lowest p-8 rounded-xl flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                  <div className={`w-12 h-12 rounded-full ${ev.bg} flex items-center justify-center mb-6`}>
                    <span className={`material-symbols-outlined ${ev.color}`}>{ev.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-headline">{ev.title}</h3>
                  <p className="text-on-surface-variant mb-8 flex-grow">{ev.desc}</p>
                  <div className="pt-6 border-t border-outline-variant/10 space-y-2">
                    <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      {ev.date}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">location_on</span>
                      {ev.lokasi}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pengumuman */}
        <section id="pengumuman" className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16">
              <p className="text-sm font-bold text-surface-tint uppercase tracking-widest mb-2">Warta Digital</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Informasi &amp; Pengumuman</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-primary-container rounded-xl p-10 text-white relative overflow-hidden flex flex-col justify-between min-h-[280px]">
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full">
                    Pengumuman Penting
                  </span>
                  <h3 className="text-2xl font-bold mb-4 leading-tight font-headline">
                    Layanan Pengajuan Surat Kini Tersedia Secara Digital
                  </h3>
                  <p className="text-white/80">
                    Warga Rusun Cinta Kasih Tzu Chi kini dapat mengajukan surat domisili dan pengantar langsung melalui portal ini tanpa perlu datang ke sekretariat.
                  </p>
                </div>
                <Link href="/login" className="mt-6 text-white font-bold flex items-center gap-2 relative z-10 group">
                  Ajukan Sekarang
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
                </Link>
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                  <span className="text-[180px] font-black leading-none">RW</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { cat: "Keamanan", title: "Sistem CCTV Baru di Area Parkir dan Lobi", desc: "Penambahan 12 titik kamera pengawas untuk meningkatkan keamanan seluruh area rusun." },
                  { cat: "Fasilitas", title: "Jadwal Pemeliharaan Lift Blok A & B", desc: "Pemeliharaan rutin lift akan dilaksanakan setiap Senin pukul 08.00–10.00 WIB." },
                  { cat: "Sosial", title: "Program Beasiswa Anak Warga Rusun 2025", desc: "Pendaftaran program beasiswa pendidikan dari Yayasan Tzu Chi dibuka hingga 30 April 2025." },
                ].map((news) => (
                  <div key={news.title} className="p-6 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-colors cursor-pointer">
                    <span className="text-xs font-bold text-surface-tint mb-2 block uppercase">{news.cat}</span>
                    <h4 className="text-base font-bold text-on-surface mb-1 font-headline">{news.title}</h4>
                    <p className="text-sm text-on-surface-variant">{news.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Profil Rusun */}
        <section id="profil" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center">
              <p className="text-sm font-bold text-surface-tint uppercase tracking-widest mb-2">Tentang Kami</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Profil {PROFILE.nama}</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-8">
                  <h3 className="text-lg font-bold mb-6 font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-surface-tint">info</span>
                    Identitas Wilayah
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: "Nama Rusun", value: PROFILE.nama },
                      { label: "RW", value: PROFILE.rw },
                      { label: "Kelurahan", value: PROFILE.kelurahan },
                      { label: "Kecamatan", value: PROFILE.kecamatan },
                      { label: "Kota / Provinsi", value: `${PROFILE.kota}, ${PROFILE.provinsi}` },
                      { label: "Alamat", value: PROFILE.alamat },
                      { label: "Email", value: PROFILE.email },
                    ].map((row) => (
                      <div key={row.label} className="grid grid-cols-5 gap-2 text-sm">
                        <div className="col-span-2 text-on-surface-variant font-medium">{row.label}</div>
                        <div className="col-span-1 text-center text-on-surface-variant">:</div>
                        <div className="col-span-2 font-semibold text-on-surface">{row.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-8">
                  <h3 className="text-lg font-bold mb-6 font-headline flex items-center gap-2">
                    <span className="material-symbols-outlined text-surface-tint">diversity_3</span>
                    Tentang Tzu Chi
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm mb-4">
                    Rusun Cinta Kasih Tzu Chi dibangun oleh Yayasan Buddha Tzu Chi Indonesia sebagai bentuk kepedulian sosial terhadap masyarakat yang membutuhkan hunian layak di Jakarta.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed text-sm mb-4">
                    Berlokasi di Cengkareng Timur, Jakarta Barat, rusun ini menampung ratusan keluarga dengan fasilitas lengkap termasuk klinik, sekolah, dan ruang ibadah yang dikelola bersama.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed text-sm">
                    Melalui platform digital ini, pengurus RW 017 berkomitmen untuk menjalankan administrasi yang transparan, cepat, dan mudah diakses oleh seluruh warga.
                  </p>
                </div>

                <div className="bg-primary-container rounded-xl p-8 text-white relative overflow-hidden">
                  <h3 className="text-lg font-bold mb-4 font-headline relative z-10">Hubungi Sekretariat</h3>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/70">location_on</span>
                      <p className="text-sm text-white/90">{PROFILE.alamat}, {PROFILE.kelurahan}, {PROFILE.kota}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-white/70">mail</span>
                      <p className="text-sm text-white/90">{PROFILE.email}</p>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <span className="text-[120px] font-black leading-none">017</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-surface-container-highest rounded-2xl p-12 md:p-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <span className="text-6xl mb-8 material-symbols-outlined text-surface-tint fill-icon">apartment</span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface mb-6 leading-tight font-headline">
                Bersama Membangun Rusun yang Nyaman dan Bermartabat
              </h2>
              <p className="text-lg text-on-surface-variant mb-10">
                Masuk ke portal warga untuk mengakses seluruh layanan administrasi digital Rusun Cinta Kasih Tzu Chi.
              </p>
              <Link
                href="/login"
                className="px-10 py-4 bg-gradient-to-r from-surface-tint to-primary-container text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
              >
                Masuk ke Portal Warga
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
              <span className="text-[240px] font-black leading-none">017</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white fill-icon">apartment</span>
              </div>
              <div>
                <div className="font-headline font-black text-blue-900 text-base leading-none">Cinta Kasih Tzu Chi</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">{PROFILE.rw} · {PROFILE.kelurahan}</div>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Platform digital administrasi warga untuk menciptakan hunian yang transparan, harmonis, dan berdaya.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h5 className="font-bold text-on-surface mb-4 uppercase tracking-wider text-xs">Sekretariat</h5>
              <address className="not-italic text-sm text-slate-500 leading-relaxed">
                {PROFILE.alamat}<br />
                Kel. {PROFILE.kelurahan}<br />
                Kec. {PROFILE.kecamatan}, {PROFILE.kota}<br />
                {PROFILE.email}
              </address>
            </div>
            <div>
              <h5 className="font-bold text-on-surface mb-4 uppercase tracking-wider text-xs">Menu</h5>
              <div className="flex flex-col gap-3">
                <a href="#profil" className="text-slate-500 hover:text-blue-600 transition-all text-sm">Profil Rusun</a>
                <a href="#kegiatan" className="text-slate-500 hover:text-blue-600 transition-all text-sm">Kegiatan</a>
                <a href="#pengumuman" className="text-slate-500 hover:text-blue-600 transition-all text-sm">Pengumuman</a>
                <Link href="/login" className="text-slate-500 hover:text-blue-600 transition-all text-sm">Portal Warga</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2025 RW 017 Rusun Cinta Kasih Tzu Chi. Semua Hak Dilindungi.</p>
          <span className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Sistem Online
          </span>
        </div>
      </footer>
    </div>
  );
}
