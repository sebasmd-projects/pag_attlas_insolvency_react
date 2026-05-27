// src/app/api/platform/calculator/user/route.ts

import { userIdentificationSchema, userRegistrationSchema } from '@/lib/validation/schemas';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';

/**
 * POST — Buscar cliente existente
 * Backend: GET /clients/search/?documentNumber=xxx&birthDate=yyyy-mm-dd
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

        const response = await axios.get(`${apiBaseUrl}/clients/search/`, {
            params: { documentNumber: cedula, birthDate },
            timeout: 10000,
        });

        const u = response.data;
        return NextResponse.json({
            success: true,
            found: true,
            user: {
                id:        u.id,
                formId:    u.form_id  ?? null,
                cedula:    u.documentNumber,
                firstName: u.firstName,
                lastName:  u.lastName,
                email:     u.email    ?? '',
                phone:     u.phone    ?? '',
                address:   u.address  ?? '',
                birthDate: u.birthDate,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404 || error.response?.status === 400) {
                return NextResponse.json({ success: true, found: false, user: null });
            }
            serverLogger.error('Error searching user', { error: error.message });
            return NextResponse.json(
                { success: false, error: 'BACKEND_ERROR',
                  detail: error.response?.data?.detail || 'Error al buscar usuario' },
                { status: error.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { success: false, error: 'INTERNAL_ERROR', detail: 'Error interno' },
            { status: 500 }
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
            { timeout: 10000 }
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