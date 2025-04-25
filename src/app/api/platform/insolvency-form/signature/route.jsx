// src/app/api/platform/signature/route.jsx

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { cedula, signature } = await request.json();
        const token = cookies().get('token')?.value;
        const res = await fetch(
            `https://propensionesabogados.com/api/v1/insolvency-form/signature/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ cedula, signature }),
                credentials: 'include',
            }
        );
        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data }, { status: res.status });
        }
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Error interno en el servidor' },
            { status: 500 }
        );
    }
}
