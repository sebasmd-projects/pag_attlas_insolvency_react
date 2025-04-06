import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    cookies().set('auth_token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        expires: new Date(0),
    });

    return NextResponse.json({ success: true });
}
