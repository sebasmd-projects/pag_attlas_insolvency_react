// src/app/api/platform/calculator/user/verify/route.ts

import { z } from 'zod';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';
import { mapVerifyResponse, LOOKUP_COOKIE } from '@/lib/calculatorLookup';

const verifySchema = z.object({
    challengeId: z.string().min(1),
    code: z.string().regex(/^\d{6}$/),
});

/**
 * POST — Verificar el código OTP (paso 2).
 * Backend: POST /clients/lookup/verify/. El token de alcance "lookup" va SOLO
 * en la cookie HttpOnly `lookup_token` (nunca en auth_token ni en el cuerpo).
 */
export async function POST(request: Request) {
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
            `${apiBaseUrl}/clients/lookup/verify/`,
            { challenge_id: validation.data.challengeId, code: validation.data.code },
            { headers: djangoHeaders(), timeout: 10000, validateStatus: () => true }
        );

        const mapped = mapVerifyResponse(response.status, response.data);
        const res = NextResponse.json(mapped.body, { status: mapped.status });

        if (mapped.token) {
            res.cookies.set({
                name: LOOKUP_COOKIE,
                value: mapped.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: mapped.expiresIn ?? 1800,
            });
        }
        return res;

    } catch (error) {
        serverLogger.error('Error verifying lookup code', {
            error: error instanceof Error ? error.message : 'unknown',
        });
        return NextResponse.json(
            { success: false, error: 'BACKEND_ERROR' },
            { status: 502 }
        );
    }
}
