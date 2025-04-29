'use client';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createContext, useContext, useState } from "react";

const Context = createContext();
const theme = createTheme({
    typography: {
        fontFamily: 'var(--font-montserrat), sans-serif',
    },
});

const GlobalContext = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isAdmin: false,
        token: "",
        tours: []
    });

    const setTours = (tours) => setState(state => ({...state, tours}));

    const provider = {
        user: state.user,
        isAdmin: state.isAdmin,
        tours: state.tours,
        token: state.token,

        setUser: (user) => setState(state => ({...state, user})),
        setToken: (token) => setState(state => ({...state, token})),
        setAdmin: () => setState(state => ({...state, isAdmin: true})),
        logout: () => setState(state => ({...state, user: null, isAdmin: false})),
        setTours,
        changeAvgMark: (id, avgMark, amount) => setTours(state.tours
            .map(tour => tour.id === id ? { ...tour, avgMark, amount } : tour)
        ),
        changeTour: (data) => setTours(state.tours.map(tour =>
            tour.id === data.id ? { ...tour, ...data } : tour)
        ),
        deleteTour: (id) => setTours(state.tours.filter(tour => tour.id !== id))
    };

    return (
        <ThemeProvider theme={theme}>
            <Context.Provider value={provider}>
                {children}
            </Context.Provider>
        </ThemeProvider>
    );
}

export default GlobalContext;

const useUser = () => {
    const { user, setUser } = useContext(Context);

    return { user, setUser };
}

const useLogout = () => useContext(Context).logout;

const useToken = () => {
    const { token, setToken } = useContext(Context);

    return { token, setToken };
}

const useAdmin = () => {
    const { isAdmin, setAdmin } = useContext(Context);

    return { isAdmin, setAdmin };
}

const useTours = () => {
    const { tours, setTours, changeTour, changeAvgMark, deleteTour } = useContext(Context);

    return { tours, setTours, changeTour, changeAvgMark, deleteTour };
}

export { useUser, useLogout, useToken, useAdmin, useTours };