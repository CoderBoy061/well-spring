"use client";

const TOKEN_KEY = "wellspring.token";
const CREATOR_KEY = "wellspring.creator";

export type StoredCreator = {
  id?: string;
  creatorId?: string;
  name?: string;
  email?: string;
};

export const storage = {
  getToken() {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
  },

  getCreator() {
    if (typeof window === "undefined") {
      return null;
    }

    const value = window.localStorage.getItem(CREATOR_KEY);

    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as StoredCreator;
    } catch {
      window.localStorage.removeItem(CREATOR_KEY);
      return null;
    }
  },

  setCreator(creator: StoredCreator) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CREATOR_KEY, JSON.stringify(creator));
  },

  clearCreator() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(CREATOR_KEY);
  },

  clearSession() {
    this.clearToken();
    this.clearCreator();
  },
};
