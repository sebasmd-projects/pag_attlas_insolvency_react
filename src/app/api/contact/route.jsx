// src/app/api/contact/route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';

export async function POST(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    try {
        const data = await request.json();

        const response = await axios.post(
            `${apiBaseUrl}/contact/`,
            data,
            { timeout: 10000 }
        );

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        serverLogger.error('Error in contact route', {
            error: error?.message,
            status: error?.response?.status,
        });
        
        return NextResponse.json(
            { detail: error?.response?.data?.detail || 'Error al enviar el formulario de contacto' },
            { status: 400 }
        );
    }
}
