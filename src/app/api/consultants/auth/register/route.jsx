// src/app/api/consultants/auth/register/route.jsx

import { z } from 'zod';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import {
    isAllowedEmailDomain,
    buildRegisterPayload,
    mapRegisterResponse,
} from '@/lib/consultantRegister';

const registerSchema = z
    .object({
        first_name: z.string().trim().min(1),
        last_name: z.string().trim().min(1),
        email: z.string().trim().toLowerCase().email().refine(isAllowedEmailDomain),
        password: z.string().min(1),
        password_confirm: z.string().min(1),
    })
    .refine((d) => d.password === d.password_confirm, { path: ['password_confirm'] });

/**
 * POST — Paso 1 del registro de asesores. Django responde 202 {challenge_id}
 * y envía un código al correo. No inicia sesión.
 */
export async function POST(request) {
    const { isValid } = validateOrigin(request);
    if (!isValid) return corsErrorResponse();

    try {
        const data = await request.json();
        const validation = registerSchema.safeParse(data);
        if (!validation.success) {
            const fields = {};
            for (const issue of validation.error.issues) {
                const key = String(issue.path[0] ?? 'non_field_errors');
                fields[key] = ['invalid'];
            }
            return NextResponse.json(
                { success: false, error: 'VALIDATION_ERROR', fields },
                { status: 400 }
            );
        }

        const response = await axios.post(
            `${apiBaseUrl}/register-consultants/`,
            buildRegisterPayload(validation.data),
            { headers: djangoHeaders({}, request), timeout: 10000, validateStatus: () => true }
        );

        const mapped = mapRegisterResponse(response.status, response.data);
        return NextResponse.json(mapped.body, { status: mapped.status });
    } catch (error) {
        serverLogger.error('Error registering consultant', {
            error: error instanceof Error ? error.message : 'unknown',
        });
        return NextResponse.json(
            { success: false, error: 'BACKEND_ERROR' },
            { status: 502 }
        );
    }
}
