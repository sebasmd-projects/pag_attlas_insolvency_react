import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        const response = await axios.post(
            'https://propensionesabogados.com/api/v1/contact/',
            data
        );

        return NextResponse.json(response.data, {
            status: 200,
        });
    } catch (error) {
        console.error('Error en contact route:', error?.message);
        return NextResponse.json(
            {
                detail:
                    error?.response?.data?.detail ||
                    'Error al enviar el formulario de contacto',
            },
            {
                status: 400,
            }
        );
    }
}
