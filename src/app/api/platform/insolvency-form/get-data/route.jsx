// src/app/api/platform/insolvency-form/get-data/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const rawToken = cookies().get('auth_token')?.value;
    if (!rawToken) {
        return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') || '1';

    try {
        const { data, status } = await axios.get(
            `http://localhost:8000/api/v1/insolvency-form/?step=${step}`,
            {
                headers: {
                    Authorization: `Bearer ${rawToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return NextResponse.json(data, { status });
    } catch (err) {
        const msg = err.response?.data || err.message || 'Error';
        const code = err.response?.status || 500;
        return NextResponse.json(msg, { status: code });
    }
}
