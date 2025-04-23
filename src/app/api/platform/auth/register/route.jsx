// src/app/api/platform/auth/register/route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();

        const response = await axios.post(
            'http://localhost:8000/api/v1/register/',
            data
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
