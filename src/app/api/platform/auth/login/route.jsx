// src/app/api/platform/auth/login/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        const response = await axios.post('https://propensionesabogados.com/api/v1/login/', data);

        const token = response.data.token;

        cookies().set('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600,
        });

        return NextResponse.json({ success: true }, { status: 200 });
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
