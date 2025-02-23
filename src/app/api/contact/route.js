// app/api/contact/route.js
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { email, last_name, message, name, subject } = await request.json();

    try {
        const response = await axios.post('http://localhost:8000/api/v1/contact/', {
            name,
            last_name,
            email,
            subject,
            message,
        });
        return NextResponse.json(response.data, { status: 200 });
    } catch {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}