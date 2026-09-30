// src/app/api/platform/calculator/user/route.ts

import { userIdentificationSchema, userRegistrationSchema } from '@/lib/validation/schemas';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';
import { mapLookupResponse } from '@/lib/calculatorLookup';

/**
 * POST — Iniciar identificación (paso 1 del OTP).
 * Backend: POST /clients/lookup/  → siempre 202 {challenge_id}, exista o no el cliente.
 */
export async function POST(request: Request) {
    const { isValid } = validateOrigin(request);
    if (!isValid) return corsErrorResponse();

    try {
        const data = await request.json();
        const validation = userIdentificationSchema.safeParse(data);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'VALIDATION_ERROR',
                  detail: validation.error.issues[0]?.message || 'Datos inválidos' },
                { status: 400 }
            );
        }

        const { cedula, birthDate } = validation.data;

        const response = await axios.post(
            `${apiBaseUrl}/clients/lookup/`,
            { documentNumber: cedula, birthDate },
            { headers: djangoHeaders({}, request), timeout: 10000, validateStatus: () => true }
        );

        const mapped = mapLookupResponse(response.status, response.data);
        return NextResponse.json(mapped.body, { status: mapped.status });

    } catch (error) {
        serverLogger.error('Error starting user lookup', {
            error: error instanceof Error ? error.message : 'unknown',
        });
        return NextResponse.json(
            { success: false, error: 'BACKEND_ERROR' },
            { status: 502 }
        );
    }
}

/**
 * PUT — Registrar cliente nuevo en un solo paso.
 * Backend: POST /clients/  → ClientCreateSerializer
 * Crea auth user + form con datos personales atómicamente.
 */
export async function PUT(request: Request) {
    const { isValid } = validateOrigin(request);
    if (!isValid) return corsErrorResponse();

    try {
        const data = await request.json();
        const validation = userRegistrationSchema.safeParse(data);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'VALIDATION_ERROR',
                  detail: validation.error.issues[0]?.message || 'Datos inválidos' },
                { status: 400 }
            );
        }

        const { cedula, birthDate, firstName, lastName, email, phone, address } = validation.data;

        const createRes = await axios.post(
            `${apiBaseUrl}/clients/`,
            {
                documentNumber: cedula,
                birthDate,
                firstName,
                lastName,
                email:   email   ?? '',
                phone:   phone   ?? '',
                address: address ?? '',
            },
            { headers: djangoHeaders({}, request), timeout: 10000 }
        );

        const u = createRes.data;

        return NextResponse.json({
            success: true,
            user: {
                id:        u.id,
                formId:    u.formId ?? null,
                cedula:    u.documentNumber ?? cedula,
                firstName: u.firstName      ?? firstName,
                lastName:  u.lastName       ?? lastName,
                email:     u.email          ?? email    ?? '',
                phone:     u.phone          ?? phone    ?? '',
                address:   u.address        ?? address  ?? '',
                birthDate: u.birthDate      ?? birthDate,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errData = error.response.data;
                if (errData?.documentNumber) {
                    return NextResponse.json(
                        { success: false, error: 'USER_EXISTS',
                          detail: Array.isArray(errData.documentNumber)
                              ? errData.documentNumber[0]
                              : errData.documentNumber },
                        { status: 409 }
                    );
                }
                return NextResponse.json(
                    { success: false, error: 'VALIDATION_ERROR',
                      detail: errData?.detail || errData?.non_field_errors?.[0] || 'Datos inválidos' },
                    { status: 400 }
                );
            }
            serverLogger.error('Error registering user', {
                error: error.message, status: error.response?.status,
            });
            return NextResponse.json(
                { success: false, error: 'BACKEND_ERROR',
                  detail: error.response?.data?.detail || 'Error al crear usuario' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'INTERNAL_ERROR', detail: 'Error interno' },
            { status: 500 }
        );
    }
}