"use client";

import { ThemeProvider } from "@mui/material/styles";
import { createContext, useState, useRef, useMemo, useEffect } from "react";
import { theme } from "./theme";
import { DEFAULT_PAGE_SIZE } from "@/hooks/constants";
import useQuery from "@/hooks/query.hook";
import { currencies } from "@/lists/currencies";
import { getCurrencyApiEndpoint } from "@/constants/queryPaths";

export const Context = createContext();

const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [currency, setCurrency] = useState(currencies[0]);
  const [conversionRate, setConversionRate] = useState(1);
  const toursSearchParamsRef = useRef({
    formValues: null,
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const { query } = useQuery();

  useEffect(() => {
    if (currency === currencies[0]) {
      setConversionRate(1);
    } else {
      query(getCurrencyApiEndpoint(currency))
        .then((res) => setConversionRate(res.conversion_rate))
        .catch(() => setCurrency(currencies[0]));
    }
  }, [currency]);

  const provider = useMemo(
    () => ({
      user,
      toursSearchParamsRef,
      isAdmin: !!user?.admin,
      currency,
      conversionRate,
      setUser,
      setCurrency,
    }),
    [user, currency, conversionRate],
  );

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={provider}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default GlobalContext;
