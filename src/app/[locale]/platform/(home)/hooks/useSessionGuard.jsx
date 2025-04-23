// src/app/[locale]/platform/(home)/hooks/useSessionGuard.js

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function useSessionGuard() {
    const router = useRouter();
    const isSessionValid = useCallback(async () => {
        const res = await fetch('/api/platform/auth/token-info');
        if (!res.ok) {
            router.push('/platform/auth/login');
            return false;
        }
        return true;
    }, [router]);
    return { isSessionValid };
}