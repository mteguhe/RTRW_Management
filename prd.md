# PRD – Website RT/RW Management System

> **Version:** 1.2 – MVP
> **Platform:** Web
> **Tanggal:** April 2026
> **Status:** Draft

---

## Daftar Isi

1. [Tujuan Produk](#1-tujuan-produk)
2. [Target User](#2-target-user)
3. [Core Features (MVP)](#3-core-features-mvp)
4. [Nice-to-Have (Phase 2)](#4-nice-to-have-phase-2)
5. [Arsitektur Sistem](#5-arsitektur-sistem)
6. [API Design](#6-api-design)
7. [Database Schema](#7-database-schema)
8. [Security](#8-security)
9. [Development Roadmap](#9-development-roadmap)
10. [UX Principles](#10-ux-principles)
11. [Testing](#11-testing)
12. [Deployment](#12-deployment)

---

## 1. Tujuan Produk

Membuat platform digital untuk RT/RW yang:

- Mempermudah administrasi warga
- Menyediakan transparansi keuangan
- Menjadi pusat informasi & komunikasi warga

---

## 2. Target User

### Primary
- **Warga** — pengguna utama yang mengajukan surat, melihat pengumuman, dan cek iuran
- **Admin RT** — mengelola data warga di tingkat RT, approve surat tahap pertama
- **Admin RW** — approve surat tahap akhir, manajemen tingkat RW

### Secondary
- **Tamu / Calon Warga** — akses terbatas, hanya bisa melihat pengumuman publik

---

## 3. Core Features (MVP)

### 3.1 Authentication & Role

**Role:**

| Role | Akses |
|------|-------|
| Admin RW | View statistik & detail warga, pending surat, kas RW, pengumuman |
| Admin RT | CRUD data warga (pindahan, lahir, meninggal), pending surat, kas RT, pengumuman |
| Warga | Data keluarga serumah, riwayat iuran, pengeluaran kas RT/RW (read-only), pengajuan surat |
| Guest | View-only konten publik |

**Fitur:**
- Login / Logout
- Register warga (opsional: invite code)
- Role-based access control (RBAC)

---

### 3.2 Dashboard

**Admin RW:**
- Statistik total warga
- Detail data warga
- Pending pengajuan surat
- Ringkasan kas masuk/keluar RW
- Pengumuman terbaru

**Admin RT:**
- Statistik total warga
- CRUD data warga (pindahan, lahir, meninggal)
- Detail data warga
- Pending pengajuan surat
- Ringkasan kas masuk/keluar RT
- Pengumuman terbaru

**Warga:**
- Status iuran bulan berjalan
- Status pengajuan surat aktif
- Pengumuman terbaru

---

### 3.3 Pengumuman & Berita

- CRUD pengumuman (admin RT & RW)
- List pengumuman (semua user)
- Kategori: `umum`, `darurat`, `kegiatan`

---

### 3.4 Layanan Surat ⭐ (Fitur Prioritas)

**Jenis surat:**
- Surat Domisili
- Surat Pengantar

**Flow pengajuan (dua tahap):**

```
Warga isi form
    → Admin RT review → Approve / Reject
        → Admin RW review → Approve / Reject
            → Generate PDF → Download
```

**Status surat:**

| Status | Keterangan |
|--------|-----------|
| `pending_rt` | Menunggu review Admin RT |
| `approved_rt` | Disetujui RT, menunggu RW |
| `rejected_rt` | Ditolak oleh Admin RT |
| `pending_rw` | Menunggu review Admin RW |
| `approved_rw` | Disetujui RW, siap generate PDF |
| `rejected_rw` | Ditolak oleh Admin RW |
| `done` | PDF sudah digenerate & bisa didownload |

---

### 3.5 Keuangan (Kas RT & Kas RW)

- Input pemasukan (iuran, donasi, dll)
- Input pengeluaran
- Laporan bulanan
- Kas RT dikelola Admin RT; Kas RW dikelola Admin RW
- View warga (read-only, tidak bisa edit)

---

### 3.6 Data Warga

**Admin RT/RW:** CRUD data warga lengkap
**Warga:** View profil sendiri dan anggota keluarga serumah (1 No KK)

**Data warga:**

| Field | Type | Keterangan |
|-------|------|-----------|
| Nama | VARCHAR(255) | Nama lengkap |
| NIK | VARCHAR(16) UNIQUE | Nomor Induk Kependudukan (16 digit) |
| No KK | VARCHAR(16) | Nomor Kartu Keluarga |
| Alamat | TEXT | Alamat lengkap dalam RT/RW |
| Blok | VARCHAR(20) | Blok / Nomor Rumah |
| Lantai | VARCHAR(10) | Lantai (untuk apartemen / rusun) |
| Status Pernikahan | ENUM | `lajang` / `kawin` / `cerai_hidup` / `cerai_mati` |
| Agama | ENUM | `islam` / `kristen` / `katolik` / `hindu` / `budha` / `other` |
| Tempat Lahir | VARCHAR(100) | Kota kelahiran |
| Tanggal Lahir | DATE | Format: YYYY-MM-DD |
| Jenis Kelamin | ENUM | `pria` / `wanita` |
| Status Warga | ENUM | `aktif` / `tidak_aktif` |

---

### 3.7 Pengaduan Warga

- Warga bisa kirim laporan/pengaduan
- Admin bisa merespons dan update status
- Status: `open` → `in_progress` → `resolved`

---

## 4. Nice-to-Have (Phase 2)

| Fitur | Keterangan |
|-------|-----------|
| Notifikasi WhatsApp | Notif otomatis untuk surat & pengumuman |
| Voting Warga | Fitur polling untuk keputusan RT/RW |
| Jadwal Ronda | Manajemen jadwal & giliran ronda |
| QR Absensi | QR code untuk absensi kegiatan warga |
| Mobile App | React Native / Flutter (future) |

---

## 5. Arsitektur Sistem

### Backend (Go)

**Framework & Libraries:**

```
Framework : Gin
ORM       : GORM
Auth      : JWT
```

**Struktur Folder:**

```
/cmd
/internal
  /handler
  /service
  /repository
  /model
  /middleware
/pkg
```

### Database

```
MySQL 8.x (managed / Docker)
```

> **Catatan GORM:** Ganti driver dari `gorm.io/driver/postgres` ke `gorm.io/driver/mysql`.
> Gunakan `BIGINT UNSIGNED AUTO_INCREMENT` untuk primary key, atau `CHAR(36)` untuk UUID.
> MySQL ENUM didefinisikan langsung di DDL atau via GORM tag `type:enum(...)`.

### Frontend

> **Rekomendasi: Next.js + Tailwind CSS + shadcn/ui**

| Option | Stack | Keterangan |
|--------|-------|-----------|
| ✅ Option 1 (Recommended) | Next.js + Tailwind + shadcn/ui | Best balance, SEO bagus, mudah scaling |
| Option 2 | Vue.js | Lebih mudah dipelajari, cocok dashboard |
| Option 3 | React + Vite | Enterprise-ready |

---

## 6. API Design

### Auth

```
POST  /api/auth/login
POST  /api/auth/register
GET   /api/auth/me
```

### Warga (Residents)

```
GET    /api/residents
POST   /api/residents
GET    /api/residents/:id
PUT    /api/residents/:id
DELETE /api/residents/:id
GET    /api/residents/family/:no_kk
```

### Pengumuman (Announcements)

```
GET    /api/announcements
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id
```

### Layanan Surat (Letters)

```
POST   /api/letters
GET    /api/letters
GET    /api/letters/:id
PUT    /api/letters/:id/approve-rt
PUT    /api/letters/:id/reject-rt
PUT    /api/letters/:id/approve-rw
PUT    /api/letters/:id/reject-rw
GET    /api/letters/:id/download
```

### Keuangan (Finances)

```
GET    /api/finances
POST   /api/finances
GET    /api/finances/summary
GET    /api/finances?scope=rt
GET    /api/finances?scope=rw
```

### Pengaduan (Complaints)

```
GET    /api/complaints
POST   /api/complaints
PUT    /api/complaints/:id/status
```

---

## 7. Database Schema

> **Database:** MySQL 8.x
> **Charset:** `utf8mb4` — wajib untuk mendukung karakter Indonesia & emoji
> **Collation:** `utf8mb4_unicode_ci`
> **Engine:** InnoDB (default, mendukung foreign key & transaction)

---

### Tabel `users`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| name | VARCHAR(255) NOT NULL | Nama lengkap |
| email | VARCHAR(255) NOT NULL UNIQUE | Email login |
| password | VARCHAR(255) NOT NULL | Bcrypt hash |
| role | ENUM('admin_rw','admin_rt','warga','guest') NOT NULL | Role user |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |
| updated_at | DATETIME ON UPDATE CURRENT_TIMESTAMP | — |

---

### Tabel `residents`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| user_id | BIGINT UNSIGNED NULL | FK → users (nullable) |
| nik | VARCHAR(16) NOT NULL UNIQUE | NIK 16 digit |
| no_kk | VARCHAR(16) NOT NULL | Nomor Kartu Keluarga |
| nama | VARCHAR(255) NOT NULL | Nama lengkap |
| alamat | TEXT | Alamat lengkap |
| blok | VARCHAR(20) | Blok / Nomor Rumah |
| lantai | VARCHAR(10) | Lantai (opsional) |
| status_pernikahan | ENUM('lajang','kawin','cerai_hidup','cerai_mati') | — |
| agama | ENUM('islam','kristen','katolik','hindu','budha','other') | — |
| tempat_lahir | VARCHAR(100) | Kota kelahiran |
| tanggal_lahir | DATE | Format: YYYY-MM-DD |
| jenis_kelamin | ENUM('pria','wanita') | — |
| status_warga | ENUM('aktif','tidak_aktif') DEFAULT 'aktif' | — |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |
| updated_at | DATETIME ON UPDATE CURRENT_TIMESTAMP | — |

---

### Tabel `announcements`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| title | VARCHAR(255) NOT NULL | Judul pengumuman |
| content | TEXT NOT NULL | Isi pengumuman |
| category | ENUM('umum','darurat','kegiatan') NOT NULL | — |
| author_id | BIGINT UNSIGNED NOT NULL | FK → users |
| published_at | DATETIME | Tanggal publish |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |

---

### Tabel `letters`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| user_id | BIGINT UNSIGNED NOT NULL | FK → users (pemohon) |
| resident_id | BIGINT UNSIGNED NOT NULL | FK → residents |
| type | ENUM('domisili','pengantar') NOT NULL | Jenis surat |
| status | ENUM('pending_rt','approved_rt','rejected_rt','pending_rw','approved_rw','rejected_rw','done') DEFAULT 'pending_rt' | Status alur |
| notes_rt | TEXT | Catatan Admin RT |
| notes_rw | TEXT | Catatan Admin RW |
| reviewed_by_rt | BIGINT UNSIGNED NULL | FK → users (Admin RT) |
| reviewed_by_rw | BIGINT UNSIGNED NULL | FK → users (Admin RW) |
| file_url | VARCHAR(500) | URL PDF yang digenerate |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |
| updated_at | DATETIME ON UPDATE CURRENT_TIMESTAMP | — |

---

### Tabel `finances`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| scope | ENUM('rt','rw') NOT NULL | Kas RT atau RW |
| type | ENUM('income','expense') NOT NULL | Pemasukan / Pengeluaran |
| amount | DECIMAL(15,2) NOT NULL | Nominal |
| description | TEXT | Keterangan |
| date | DATE NOT NULL | Tanggal transaksi |
| created_by | BIGINT UNSIGNED NOT NULL | FK → users (admin input) |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |

---

### Tabel `complaints`

| Field | Type | Keterangan |
|-------|------|-----------|
| id | BIGINT UNSIGNED AUTO_INCREMENT | Primary key |
| user_id | BIGINT UNSIGNED NOT NULL | FK → users (pelapor) |
| title | VARCHAR(255) NOT NULL | Judul laporan |
| description | TEXT NOT NULL | Detail pengaduan |
| status | ENUM('open','in_progress','resolved') DEFAULT 'open' | — |
| response | TEXT | Respons admin |
| responded_by | BIGINT UNSIGNED NULL | FK → users (admin) |
| created_at | DATETIME DEFAULT CURRENT_TIMESTAMP | — |
| updated_at | DATETIME ON UPDATE CURRENT_TIMESTAMP | — |

---

## 8. Security

- **JWT Authentication** — token-based, stateless
- **Password Hashing** — bcrypt dengan salt
- **Role-Based Access Control (RBAC)** — middleware validasi role per endpoint
- **Rate Limiting** — opsional, cegah spam request
- **Input Validation** — sanitasi semua input dari user
- **HTTPS Only** — wajib di production

---

## 9. Development Roadmap

### Week 1 — Foundation
- Setup project backend Go (Gin + GORM + MySQL driver)
- Auth system (register, login, JWT) dengan 4 role
- Database schema & migration MySQL
- Setup project frontend Next.js

### Week 2 — Core Data
- CRUD data warga (dengan field lengkap)
- View keluarga serumah (by No KK)
- Modul pengumuman (API + UI)
- Basic dashboard (admin RT, admin RW, warga)

### Week 3 — Fitur Prioritas (Surat)
- Form pengajuan surat
- Alur approve/reject dua tahap (RT → RW)
- PDF generator (Go library)
- Download surat PDF

### Week 4 — Keuangan & Polish
- Modul keuangan kas RT & kas RW
- Modul pengaduan warga
- Polish UI/UX
- Testing & bug fixing
- Deploy ke staging

---

## 10. UX Principles

- **Mobile-first** — mayoritas warga mengakses via HP
- **Simple UI** — ramah untuk orang tua, tidak terlalu banyak opsi
- **Fast loading** — optimasi performa, lazy loading
- **Bahasa Indonesia penuh** — tidak ada campuran bahasa Inggris di UI
- **Informative feedback** — setiap aksi ada konfirmasi/notifikasi jelas

---

## 11. Testing

| Level | Tools | Cakupan |
|-------|-------|---------|
| Unit Test | Go built-in testing | Service & repository layer |
| API Test | Postman / Thunder Client | Semua endpoint |
| Basic E2E | Playwright / manual | User flow utama |

**User flow yang wajib ditest:**
1. Register → Login → Dashboard
2. Warga ajukan surat → Admin RT approve → Admin RW approve → Download PDF
3. Admin input keuangan kas RT/RW → Warga lihat laporan
4. Warga kirim pengaduan → Admin respons

---

## 12. Deployment

| Komponen | Platform | Keterangan |
|----------|----------|-----------|
| Frontend | Vercel | Auto-deploy dari GitHub |
| Backend | VPS + Docker | Containerized, mudah scaling |
| Database | MySQL 8.x | Self-hosted Docker / PlanetScale / Railway |
| File Storage | S3-compatible | Untuk penyimpanan PDF surat |

### Environment Variables yang Dibutuhkan

```env
# Backend
DB_DSN=user:password@tcp(host:3306)/rtrw_db?charset=utf8mb4&parseTime=True&loc=Local
JWT_SECRET=
JWT_EXPIRY=24h
STORAGE_BUCKET=
STORAGE_KEY=

# Frontend
NEXT_PUBLIC_API_URL=
```

---

> **Catatan:** PRD ini adalah dokumen living — akan diperbarui seiring perkembangan produk. Semua perubahan fitur atau arsitektur harus didokumentasikan di sini.
