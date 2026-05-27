// src/app/api/platform/insolvency-form/[id]/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

export async function PATCH(request, context) {

    const { params } = context;
    const { id } = await params;

    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;

    if (!rawToken) {
        return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') || '1';
    const body = await request.json();

    try {
        const { data, status } = await axios.patch(
            `${apiBaseUrl}/insolvency-form/${id}/?step=${step}`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${rawToken}`,
                },
            }
        );

        return NextResponse.json(data, { status });

    } catch (err) {
        const msg = err.response?.data || err.message || 'Error';
        const code = err.response?.status || 500;
        return NextResponse.json(msg, { status: code });
    }
}
