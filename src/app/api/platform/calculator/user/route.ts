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
                formId:    u.form_id  ?? null,   // <-- exponer form_id si el backend lo devuelve
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
 * PUT — Registrar cliente nuevo (2 pasos internos):
 *   1) POST /register/            → crea usuario, devuelve { id, form_id, token, expires_in }
 *   2) PATCH /insolvency-form/<form_id>/?step=2  → guarda datos personales
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

        // ── Paso 1: crear registro base ───────────────────────────────────────
        const registerRes = await axios.post(
            `${apiBaseUrl}/register/`,
            { documentNumber: cedula, birthDate },
            { timeout: 10000 }
        );

        const { id, form_id, token, expires_in } = registerRes.data;

        if (!form_id) {
            serverLogger.error('Backend no devolvió form_id tras registro', { id });
            return NextResponse.json(
                { success: false, error: 'MISSING_FORM_ID',
                  detail: 'El backend no devolvió el ID del formulario' },
                { status: 502 }
            );
        }

        // ── Paso 2: guardar datos personales en step 2 ────────────────────────
        await axios.patch(
            `${apiBaseUrl}/insolvency-form/${form_id}/?step=2`,
            {
                debtor_first_name:      firstName,
                debtor_last_name:       lastName,
                debtor_email:           email    ?? '',
                debtor_cell_phone:      phone    ?? '',
                debtor_address:         address  ?? '',
                debtor_document_number: cedula,
                debtor_birth_date:      birthDate,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            }
        );

        // ── Respuesta al frontend ─────────────────────────────────────────────
        const res = NextResponse.json({
            success: true,
            user: {
                id,
                formId:    form_id,
                cedula,
                firstName,
                lastName,
                email:    email   ?? '',
                phone:    phone   ?? '',
                address:  address ?? '',
                birthDate,
            },
        });

        // Persistir el token igual que en /login
        res.cookies.set({
            name:     'auth_token',
            value:    token,
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path:     '/',
            maxAge:   expires_in,
        });

        return res;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                const errData = error.response.data;
                if (errData?.documentNumber) {
                    return NextResponse.json(
                        { success: false, error: 'USER_EXISTS',
                          detail: errData.documentNumber[0] || 'El usuario ya existe' },
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