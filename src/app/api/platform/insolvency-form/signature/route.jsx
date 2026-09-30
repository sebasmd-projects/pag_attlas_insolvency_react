import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import { djangoHeaders } from '@/lib/djangoHeaders';

export async function POST(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;

    if (!rawToken) {
        return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
    }

    try {
        const body = await request.json();

        const apiUrl = `${apiBaseUrl}/insolvency-form/signature/`;

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: djangoHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${rawToken}`,
            }, request),
            body: JSON.stringify({ signature: body.signature }),
        });

        const data = await res.json();

        if (!res.ok) {
            serverLogger.error('Error in signature API response', {
                status: res.status,
            });
            return NextResponse.json({ error: data }, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        serverLogger.error('Internal error in signature route', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return NextResponse.json(
            { error: 'Error interno en el servidor' },
            { status: 500 }
        );
    }
}
