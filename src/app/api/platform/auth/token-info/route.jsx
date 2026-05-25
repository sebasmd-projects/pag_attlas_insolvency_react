// src/app/api/platform/auth/token-info/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';

export async function GET(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    try {
        const cookieStore = await cookies();
        const rawToken = cookieStore.get('auth_token')?.value;

        if (!rawToken) {
            return NextResponse.json(
                { detail: 'Token no encontrado en cookies' }, 
                { status: 401 }
            );
        }

        const response = await axios.get(`${apiBaseUrl}/token-info/`, {
            headers: {
                Authorization: `Bearer ${rawToken}`,
            },
            timeout: 10000,
        });

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        serverLogger.error('Error fetching token info', {
            error: error.message,
            status: error.response?.status,
        });

        return NextResponse.json(
            { detail: error.response?.data?.detail || 'Error al obtener informacion del token' },
            { status: error.response?.status || 500 }
        );
    }
}
