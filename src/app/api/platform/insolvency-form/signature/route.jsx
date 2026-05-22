import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

export async function POST(request) {
    try {
        const body = await request.json();

        const apiUrl = `${apiBaseUrl}/insolvency-form/signature/`;

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cedula: body.cedula, signature: body.signature }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('[API] Error en respuesta externa:', data);
            return NextResponse.json({ error: data }, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('[API] Error interno:', error);
        return NextResponse.json(
            { error: 'Error interno en el servidor' },
            { status: 500 }
        );
    }
}