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
        let errStr = data?.message || `API Error: ${response.status}`;

        if (data?.errors && Array.isArray(data.errors)) {
          const detailMsgs = data.errors
            .map((e) => e.message || JSON.stringify(e))
            .join(", ");
          if (data?.message === "Validation failed") {
            errStr = detailMsgs;
          } else {
            errStr = `${errStr}: ${detailMsgs}`;
          }
        } else if (data?.error) {
          errStr =
            typeof data.error === "string"
              ? data.error
              : JSON.stringify(data.error);
          if (data?.message) errStr = `${data.message}: ${errStr}`;
        }

        throw new Error(errStr);
      }

      return data;
    },
    [getToken],
  );
  return fetchApi;
}
