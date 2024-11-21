"use client";

const TOKEN_KEY = "auth_token";

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    // 检查是否在浏览器环境
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    // 检查是否在浏览器环境

    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    // 检查是否在浏览器环境
    localStorage.removeItem(TOKEN_KEY);
  }
}
