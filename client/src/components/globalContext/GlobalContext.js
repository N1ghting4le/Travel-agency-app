"use client";

import { ThemeProvider } from "@mui/material/styles";
import { createContext, useState, useRef, useMemo, useCallback } from "react";
import { theme } from "./theme";
import { DEFAULT_PAGE_SIZE } from "@/hooks/constants";

export const Context = createContext();

const GlobalContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const toursSearchParamsRef = useRef({
    formValues: null,
    page: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const changeAvgMark = useCallback((id, avgMark, amount) => {
    setTours((tours) =>
      tours.map((tour) =>
        tour.id === id ? { ...tour, avgMark, amount } : tour,
      ),
    );
  }, []);

  const changeTour = useCallback((data) => {
    setTours((tours) =>
      tours.map((tour) => (tour.id === data.id ? { ...tour, ...data } : tour)),
    );
  }, []);

  const deleteTour = useCallback((id) => {
    setTours((tours) => tours.filter((tour) => tour.id !== id));
  }, []);

  const provider = useMemo(
    () => ({
      user,
      tours,
      toursSearchParamsRef,
      isAdmin: !!user?.admin,
      setUser,
      setTours,
      changeAvgMark,
      changeTour,
      deleteTour,
    }),
    [user, tours, changeAvgMark, changeTour, deleteTour],
  );

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={provider}>{children}</Context.Provider>
    </ThemeProvider>
  );
};

export default GlobalContext;
