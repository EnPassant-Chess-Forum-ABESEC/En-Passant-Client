"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function useApi() {
  const { getToken } = useAuth();

  const fetchApi = useCallback(
    async (endpoint, options = {}) => {
      const token = await getToken();
      
      const headers = {
        ...options.headers,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // If body is a plain object, stringify it and set Content-Type
      // (Unless it's FormData for file uploads, where the browser sets Content-Type)
      if (
        options.body &&
        typeof options.body === "object" &&
        !(options.body instanceof FormData)
      ) {
        options.body = JSON.stringify(options.body);
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `API Error: ${response.status}`);
      }

      return data;
    },
    [getToken]
  );

  return fetchApi;
}
