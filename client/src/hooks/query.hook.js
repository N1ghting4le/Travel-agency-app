'use client';

import { useState, useCallback } from "react";

const useQuery = () => {
    const [queryState, setQueryState] = useState('idle');

    const query = useCallback((url, method = 'GET', headers = {}, body = null) => {
        return new Promise(async (resolve, reject) => {
            setQueryState('pending');

            try {
                const res = await fetch(url, { method, headers, body }),
                data = await (res.headers.get('Content-type')?.includes("json") ? res.json() : res.text());

                if (!res.ok) {
                    throw new Error(data);
                }

                setQueryState('fulfilled');
                resolve(data);
            } catch (e) {
                setQueryState('error');
                reject(e.message === "Failed to fetch" ? new Error("Произошла ошибка") : e);
                console.error(e);
            }
        });
    }, []);

    const resetQueryState = useCallback(() => setQueryState('idle'), []);

    return { query, queryState, resetQueryState };
}

export default useQuery;