import { NextResponse } from 'next/server';

export async function POST(request) {
    console.log('[API] Iniciando solicitud de firma...');
    try {
        const body = await request.json();
        console.log('[API] Cuerpo recibido:', { cedula: body.cedula, signature: body.signature?.substring(0, 50) + '...' });

        const apiUrl = 'https://propensionesabogados.com/api/v1/insolvency-form/signature/';
        console.log('[API] Enviando a:', apiUrl);

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cedula: body.cedula, signature: body.signature }),
        });

        console.log(`[API] Respuesta externa: ${res.status} ${res.statusText}`);
        const data = await res.json();
        console.log('[API] Datos respuesta externa:', data);

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