// src/app/[locale]/platform/(home)/hooks/useLocalUserStorage.jsx

'use client';

import { useEffect, useState } from 'react';

export default function useLocalUserStorage(userKey, initial) {
    const [state, setState] = useState(initial);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!userKey) {
            setIsLoaded(true);
            return;
        }

        const storedLocal = window.localStorage.getItem(userKey);
        if (storedLocal) {
            setState(JSON.parse(storedLocal));
        }
        setIsLoaded(true);
    }, [userKey]);

    useEffect(() => {
        if (userKey && isLoaded) {
            window.localStorage.setItem(userKey, JSON.stringify(state));
        }
    }, [userKey, state, isLoaded]);

    return [state, setState, isLoaded];
}
