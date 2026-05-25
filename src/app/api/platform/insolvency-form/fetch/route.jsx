// src/app/api/platform/insolvency-form/fetch/route.jsx
// GET /api/platform/insolvency-form/fetch?formId=xxx&step=0
// Proxy autenticado que usa cookies HttpOnly en lugar de localStorage

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { serverLogger } from '@/lib/logger';

export async function GET(request) {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;

    if (!rawToken) {
        return NextResponse.json(
            { detail: 'No autorizado' }, 
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get('formId');
    const step = searchParams.get('step') || '0';

    if (!formId) {
        return NextResponse.json(
            { detail: 'formId es requerido' }, 
            { status: 400 }
        );
    }

    try {
        const { data, status } = await axios.get(
            `${apiBaseUrl}/insolvency-form/${formId}/?step=${step}`,
            { 
                headers: { Authorization: `Bearer ${rawToken}` },
                timeout: 10000,
            }
        );
        return NextResponse.json(data, { status });
    } catch (err) {
        serverLogger.error('Error fetching insolvency form', {
            formId,
            step,
            error: err.message,
        });
        
        const code = err.response?.status || 500;
        const msg = err.response?.data || { detail: 'Error al obtener datos del formulario' };
        return NextResponse.json(msg, { status: code });
    }
}
