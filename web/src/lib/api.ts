import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

export const register = (name: string, email: string, password: string, role?: string) =>
  api.post("/auth/register", { name, email, password, role });

export const getMe = () => api.get("/auth/me");

// Residents
export const getResidents = (page = 1, limit = 20, search = "") =>
  api.get(`/residents?page=${page}&limit=${limit}&search=${search}`);

export const getResident = (id: number) => api.get(`/residents/${id}`);

export const getFamily = (noKK: string) => api.get(`/residents/family/${noKK}`);

export const createResident = (data: object) => api.post("/residents", data);

export const updateResident = (id: number, data: object) =>
  api.put(`/residents/${id}`, data);

export const deleteResident = (id: number) => api.delete(`/residents/${id}`);

// Announcements
export const getAnnouncements = (page = 1, limit = 10, category = "") =>
  api.get(`/announcements?page=${page}&limit=${limit}&category=${category}`);

export const createAnnouncement = (data: object) =>
  api.post("/announcements", data);

export const updateAnnouncement = (id: number, data: object) =>
  api.put(`/announcements/${id}`, data);

export const deleteAnnouncement = (id: number) =>
  api.delete(`/announcements/${id}`);

// Letters
export const getLetters = (page = 1, limit = 20, status = "") =>
  api.get(`/letters?page=${page}&limit=${limit}&status=${status}`);

export const getLetter = (id: number) => api.get(`/letters/${id}`);

export const createLetter = (data: object) => api.post("/letters", data);

export const approveLetterRT = (id: number, notes?: string) =>
  api.put(`/letters/${id}/approve-rt`, { notes });

export const rejectLetterRT = (id: number, notes?: string) =>
  api.put(`/letters/${id}/reject-rt`, { notes });

export const approveLetterRW = (id: number, notes?: string) =>
  api.put(`/letters/${id}/approve-rw`, { notes });

export const rejectLetterRW = (id: number, notes?: string) =>
  api.put(`/letters/${id}/reject-rw`, { notes });

// Finances
export const getFinances = (page = 1, limit = 20, scope = "", type = "") =>
  api.get(`/finances?page=${page}&limit=${limit}&scope=${scope}&type=${type}`);

export const getFinanceSummary = (scope: "rt" | "rw") =>
  api.get(`/finances/summary?scope=${scope}`);

export const createFinance = (data: object) => api.post("/finances", data);

// Complaints
export const getComplaints = (page = 1, limit = 20, status = "") =>
  api.get(`/complaints?page=${page}&limit=${limit}&status=${status}`);

export const getComplaint = (id: number) => api.get(`/complaints/${id}`);

export const createComplaint = (data: object) => api.post("/complaints", data);

export const updateComplaintStatus = (id: number, status: string, response?: string) =>
  api.put(`/complaints/${id}/status`, { status, response });

// Stats
export const getStats = () => api.get("/stats");

// Users
export const getRTAccounts = () => api.get("/users/rt-accounts");
export const updateUser = (id: number, data: { name?: string; password?: string }) =>
  api.put(`/users/${id}`, data);
