// src/app/api/pqrs/route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';

export async function POST(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) return corsErrorResponse();

    try {
        const formData = await request.formData();

        const response = await fetch(`${apiBaseUrl}/pqrs/`, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
            return NextResponse.json(responseData, { status: response.status });
        }

        return NextResponse.json(responseData, { status: response.status });

    } catch (error) {
        serverLogger.error('Error in PQRS route', { error: error?.message });
        return NextResponse.json(
            { detail: 'Error al enviar el formulario PQRS' },
            { status: 500 }
        );
    }
}
