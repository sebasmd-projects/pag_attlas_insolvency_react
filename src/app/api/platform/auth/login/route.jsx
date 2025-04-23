// src/app/api/platform/auth/login/route.jsx

import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        // Split the password into initials and password
        const [user, password] = data.password.split('-');

        // Create new data object with the split values
        const backendData = {
            user: user.toUpperCase(),
            password: password,
            birth_date: data.birth_date,
            document_number: data.document_number
        };

        const response = await axios.post('https://propensionesabogados.com/api/v1/login/', backendData);

        const token = response.data.token;
        const expiresIn = response.data.expires_in;

        cookies().set('auth_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/',
            maxAge: expiresIn,
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