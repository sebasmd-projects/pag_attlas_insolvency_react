// src/app/api/platform/insolvency-form/get-data/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';

export async function GET(request) {
    const cookieStore = await cookies();
    const rawToken = cookieStore.get('auth_token')?.value;

    if (!rawToken) {
        return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') || '1';

    try {
        const { data, status } = await axios.get(
            `${apiBaseUrl}/insolvency-form/?step=${step}`,
            {
                headers: djangoHeaders({
                    Authorization: `Bearer ${rawToken}`,
                    'Content-Type': 'application/json',
                }, request)
            }
        );
        return NextResponse.json(data, { status });
    } catch (err) {
        const msg = err.response?.data || err.message || 'Error';
        const code = err.response?.status || 500;
        return NextResponse.json(msg, { status: code });
    }
}
