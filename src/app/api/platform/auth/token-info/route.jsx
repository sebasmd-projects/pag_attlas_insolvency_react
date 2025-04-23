// src/app/api/platform/auth/token-info/route.js

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const rawToken = cookies().get('auth_token')?.value;

        if (!rawToken) {
            return NextResponse.json({ detail: 'Token no encontrado en cookies' }, { status: 401 });
        }

        const response = await axios.get('https://propensionesabogados.com/api/v1/token-info/', {
            headers: {
                Authorization: `Bearer ${rawToken}`,
            },
        });

        return NextResponse.json(response.data, {
            status: 200,
        });

    } catch (error) {
        console.error('Error al obtener documento:', error.message);

        return NextResponse.json(
            {
                detail:
                    error.response?.data?.detail,
            },
            {
                status: error.response?.status,
            }
        );
    }
}
