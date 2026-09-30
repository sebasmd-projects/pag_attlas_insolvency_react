// src/app/api/consultants/auth/register/verify/route.jsx

import { z } from 'zod';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import { mapRegisterVerifyResponse } from '@/lib/consultantRegister';

const verifySchema = z.object({
    challengeId: z.string().min(1),
    code: z.string().regex(/^\d{6}$/),
});

/**
 * POST — Paso 2 del registro de asesores: verificar el código del correo.
 * No pone cookies: el registro no inicia sesión.
 */
export async function POST(request) {
    const { isValid } = validateOrigin(request);
    if (!isValid) return corsErrorResponse();

    try {
        const data = await request.json();
        const validation = verifySchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'INVALID_CODE' },
                { status: 400 }
            );
        }

        const response = await axios.post(
            `${apiBaseUrl}/register-consultants/verify/`,
            { challenge_id: validation.data.challengeId, code: validation.data.code },
            { headers: djangoHeaders({}, request), timeout: 10000, validateStatus: () => true }
        );

        const mapped = mapRegisterVerifyResponse(response.status, response.data);
        return NextResponse.json(mapped.body, { status: mapped.status });
    } catch (error) {
        serverLogger.error('Error verifying consultant registration code', {
            error: error instanceof Error ? error.message : 'unknown',
        });
        return NextResponse.json(
            { success: false, error: 'BACKEND_ERROR' },
            { status: 502 }
        );
    }
}
