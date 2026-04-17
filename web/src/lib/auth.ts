"use client";

import Cookies from "js-cookie";
import { User } from "@/types";

export function saveToken(token: string) {
  Cookies.set("token", token, { expires: 1, secure: true, sameSite: "strict" });
}

export function getToken(): string | undefined {
  return Cookies.get("token");
}

export function removeToken() {
  Cookies.remove("token");
}

export function saveUser(user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function removeUser() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

export function logout() {
  removeToken();
  removeUser();
  window.location.href = "/login";
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
