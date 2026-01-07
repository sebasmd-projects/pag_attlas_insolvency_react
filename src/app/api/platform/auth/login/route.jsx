// src/app/api/platform/auth/login/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        const [user, password] = data.password.split('-');

        const backendData = {
            user: user.toUpperCase(),
            password,
            birth_date: data.birth_date,
            document_number: data.document_number,
        };

        const response = await axios.post('https://propensionesabogados.com/api/v1/login/', backendData);

        const { token, expires_in } = response.data;

        const cookieStore = await cookies();

        cookieStore.set('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: expires_in,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { detail: error?.response?.data?.detail },
            { status: 400 }
        );
    }
}