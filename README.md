# Sinergi Warga — Civic Sanctuary

Platform digital manajemen RT/RW yang modern, transparan, dan bermartabat.

## Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Go 1.21 + Gin + GORM |
| Database | MySQL 8.x |
| Frontend | Next.js 14 + Tailwind CSS |
| Auth | JWT (Bearer token) |
| Deploy | Docker + Docker Compose |

## Halaman / Fitur

### Frontend
| Halaman | Path | Keterangan |
|---------|------|-----------|
| Landing Page | `/` | Halaman publik dengan informasi RT/RW |
| Login | `/login` | Autentikasi pengguna |
| Dashboard | `/dashboard` | Ringkasan data sesuai role |
| Data Warga | `/warga` | CRUD data warga (admin) / view (warga) |
| Layanan Surat | `/surat` | Daftar surat + alur approval |
| Ajukan Surat | `/surat/ajukan` | Form pengajuan surat |
| Keuangan | `/keuangan` | Laporan kas RT/RW |
| Pengumuman | `/pengumuman` | Berita dan pengumuman |
| Pengaduan | `/pengaduan` | Laporan dan pengaduan warga |

### Backend API

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/stats
GET    /api/residents
POST   /api/residents
GET    /api/residents/:id
PUT    /api/residents/:id
DELETE /api/residents/:id
GET    /api/residents/family/:no_kk

GET    /api/announcements
POST   /api/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id

GET    /api/letters
POST   /api/letters
GET    /api/letters/:id
PUT    /api/letters/:id/approve-rt
PUT    /api/letters/:id/reject-rt
PUT    /api/letters/:id/approve-rw
PUT    /api/letters/:id/reject-rw
GET    /api/letters/:id/download

GET    /api/finances
POST   /api/finances
GET    /api/finances/summary

GET    /api/complaints
POST   /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id/status
```

## Quick Start

### 1. Jalankan dengan Docker Compose

```bash
cp backend/.env.example backend/.env
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### 2. Development Manual

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env sesuai konfigurasi database
go mod tidy
go run ./cmd/main.go
```

**Frontend:**
```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

**Backend (`backend/.env`):**
```env
DB_DSN=root:password@tcp(127.0.0.1:3306)/rtrw_db?charset=utf8mb4&parseTime=True&loc=Local
JWT_SECRET=your-super-secret-key
JWT_EXPIRY=24h
PORT=8080
CORS_ORIGIN=http://localhost:3000
```

**Frontend (`web/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Role & Akses

| Role | Akses |
|------|-------|
| `admin_rw` | Full akses RW, approve surat tahap akhir, kas RW |
| `admin_rt` | CRUD warga, approve surat tahap pertama, kas RT |
| `warga` | View profil, ajukan surat, lihat keuangan, kirim pengaduan |
| `guest` | View-only landing page & pengumuman publik |

## Struktur Proyek

```
/
├── backend/          Go backend (Gin + GORM)
│   ├── cmd/          Entry point
│   ├── internal/     Business logic
│   │   ├── config/
│   │   ├── handler/  HTTP handlers
│   │   ├── middleware/
│   │   ├── model/    Database models
│   │   └── repository/
│   └── pkg/          Shared utilities (jwt, response)
├── web/              Next.js frontend
│   └── src/
│       ├── app/      App router pages
│       ├── components/
│       ├── lib/      API client + auth utilities
│       └── types/    TypeScript types
├── Frontend/         Design references (HTML mockups)
├── docker-compose.yml
└── prd.md
```
