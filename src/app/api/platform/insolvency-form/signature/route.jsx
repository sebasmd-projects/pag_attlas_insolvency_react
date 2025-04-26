import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();

        const apiUrl = 'https://propensionesabogados.com/api/v1/insolvency-form/signature/';

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