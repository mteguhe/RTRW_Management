export type Role = "admin_rw" | "admin_rt" | "warga" | "guest";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  no_rt: number;
  created_at: string;
}

export interface Resident {
  id: number;
  user_id?: number;
  no_rt: number;
  nik: string;
  no_kk: string;
  nama: string;
  alamat: string;
  blok: string;
  lantai?: string;
  status_pernikahan: "lajang" | "kawin" | "cerai_hidup" | "cerai_mati";
  agama: "islam" | "kristen" | "katolik" | "hindu" | "budha" | "other";
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: "pria" | "wanita";
  status_warga: "aktif" | "tidak_aktif";
  created_at: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: "umum" | "darurat" | "kegiatan";
  author_id: number;
  author: User;
  published_at?: string;
  created_at: string;
}

export type LetterStatus =
  | "pending_rt"
  | "approved_rt"
  | "rejected_rt"
  | "pending_rw"
  | "approved_rw"
  | "rejected_rw"
  | "done";

export interface Letter {
  id: number;
  user_id: number;
  user: User;
  resident_id: number;
  resident: Resident;
  type: "domisili" | "pengantar";
  status: LetterStatus;
  purpose: string;
  notes_rt?: string;
  notes_rw?: string;
  reviewed_by_rt?: number;
  reviewed_by_rw?: number;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Finance {
  id: number;
  scope: "rt" | "rw";
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  created_by: number;
  creator: User;
  created_at: string;
}

export interface Complaint {
  id: number;
  user_id: number;
  user: User;
  title: string;
  description: string;
  status: "open" | "in_progress" | "resolved";
  response?: string;
  responded_by?: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface FinanceSummary {
  scope: string;
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface DashboardStats {
  total_warga: number;
  pending_surat: number;
  kas_rt: FinanceSummary;
  kas_rw: FinanceSummary;
}
