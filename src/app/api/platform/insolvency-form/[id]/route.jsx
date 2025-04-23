// src/app/api/platform/insolvency-form/[id]/route.jsx
// ------------------------------------------------------
// src/app/api/platform/insolvency-form/[id]/route.js
// PATCH  /api/platform/insolvency-form/<uuid>?step=N
// ------------------------------------------------------
import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    const rawToken = cookies().get('auth_token')?.value;
    if (!rawToken) {
        return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const step = searchParams.get('step') || '1';
    const body = await request.json();

    try {
        const { data, status } = await axios.patch(
            `http://localhost:8000/api/v1/insolvency-form/${params.id}/?step=${step}`,
            body,
            { headers: { Authorization: `Bearer ${rawToken}` } }
        );
        return NextResponse.json(data, { status });
    } catch (err) {
        const msg = err.response?.data || err.message || 'Error';
        const code = err.response?.status || 500;
        return NextResponse.json(msg, { status: code });
    }
}
