// src/app/api/consultants/auth/register/route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        const response = await axios.post(
            'https://propensionesabogados.com/api/v1/register-consultants/',
            data,
            { timeout: 5000 }
        );

        return NextResponse.json(response.data, {
            status: 200,
        });

    } catch (error) {
        return NextResponse.json(
            {
                detail: error?.response?.data?.detail,
            },
            {
                status: 400,
            }
        );
    }
}
