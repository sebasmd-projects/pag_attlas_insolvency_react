// src/app/api/platform/insolvency-form/route.jsx
// PATCH  /api/platform/insolvency-form/?step=N

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';

export async function PATCH(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;

    if (!rawToken) {
        return NextResponse.json(
            { detail: 'Token no encontrado' }, 
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') || '1';
    const body = await request.json();

    try {
        const { data, status } = await axios.patch(
            `${apiBaseUrl}/insolvency-form/?step=${step}`,
            body,
            { 
                headers: { Authorization: `Bearer ${rawToken}` },
                timeout: 30000,
            }
        );
        return NextResponse.json(data, { status });
    } catch (err) {
        serverLogger.error('Error patching insolvency form', {
            step,
            error: err.message,
            status: err.response?.status,
        });
        
        const msg = err.response?.data || { detail: 'Error al guardar el formulario' };
        const code = err.response?.status || 500;
        return NextResponse.json(msg, { status: code });
    }
}
