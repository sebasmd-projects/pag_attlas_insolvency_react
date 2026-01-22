// src/app/api/platform/auth/logout/route.jsx

import { NextResponse } from 'next/server';

export async function POST() {

  const res = NextResponse.json({ success: true });

  res.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  console.log('NODE_ENV:', process.env.NODE_ENV);

  return res;
}
