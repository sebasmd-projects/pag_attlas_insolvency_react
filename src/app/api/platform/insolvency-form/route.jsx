import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const rawToken = cookies().get('auth_token')?.value;
        const body = await request.json();

        if (!rawToken) {
            return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
        }

        // IMPORTANTE: ahora el cuerpo debe ser { compressed_form_data: "..." }
        const compressedData = body.compressed_form_data;
        if (!compressedData) {
            return NextResponse.json({ detail: 'No se encontró compressed_form_data' }, { status: 400 });
        }

        const response = await axios.post(
            'https://propensionesabogados.com/api/v1/insolvency-form/',
            { compressed_form_data: compressedData },
            {
                headers: {
                    'Authorization': `Bearer ${rawToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error('Error al enviar formulario:', error);

        let detail = 'Error del servidor';

        if (error.response) {
            if (typeof error.response.data === 'object') {
                detail = error.response.data.detail || 'Error del servidor';
            } else if (typeof error.response.data === 'string') {
                detail = error.response.data;
            }
        } else if (error.message) {
            detail = error.message;
        }

        return NextResponse.json({ detail }, { status: error.response?.status || 500 });
    }
}
