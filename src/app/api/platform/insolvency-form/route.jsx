// app/api/platform/insolvency-form/route.js

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const rawToken = cookies().get('auth_token')?.value;
        const formData = await request.json();

        if (!rawToken) {
            return NextResponse.json({ detail: 'Token no encontrado' }, { status: 401 });
        }

        const response = await axios.post(
            'https://propensionesabogados.com/api/v1/insolvency-form/',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${rawToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error('Error al enviar formulario:', error.message);
        return NextResponse.json(
            { detail: error.response?.data?.detail || 'Error del servidor' },
            { status: error.response?.status || 500 }
        );
    }
}