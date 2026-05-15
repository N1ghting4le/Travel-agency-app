"use client";

import { useState, useCallback } from "react";

import { IDLE, PENDING, ERROR, FULFILLED } from "@/constants/queryStates";
import { TOKEN_STORAGE_KEY, defaultQuerySettings } from "./constants";

const useQuery = () => {
  const [queryState, setQueryState] = useState(IDLE);

  const query = useCallback(async (url, settings) => {
    const { method, body, json, authorize, headers } = {
      ...defaultQuerySettings,
      ...(settings ?? {}),
    };

    setQueryState(PENDING);

    if (authorize) {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);

      if (token) {
        headers.authorization = `Bearer ${token}`;
      }
    }

    if (json) {
      headers["Content-type"] = "application/json";
    }

    try {
      const res = await fetch(url, { method, headers, body });
      const contentTypeHeader = res.headers.get("Content-type");
      const data = contentTypeHeader?.includes("json")
        ? await res.json()
        : await res.text();

      if (!res.ok) {
        throw new Error(data);
      }

      setQueryState(FULFILLED);
      return data;
    } catch (e) {
      setQueryState(ERROR);
      throw e;
    }
  }, []);

  const resetQueryState = useCallback(() => setQueryState(IDLE), []);

  const isLoading = queryState === PENDING;
  const isError = queryState === ERROR;
  const isSuccess = queryState === FULFILLED;
  const isIdle = queryState === IDLE;

  return {
    query,
    queryState,
    isIdle,
    isLoading,
    isError,
    isSuccess,
    resetQueryState,
  };
};

export default useQuery;
