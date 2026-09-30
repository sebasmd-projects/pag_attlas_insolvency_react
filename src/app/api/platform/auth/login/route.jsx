// src/app/api/platform/auth/login/route.jsx

import rateLimit from '@/components/lib/rate-limit';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';
import { djangoHeaders } from '@/lib/djangoHeaders';
import { splitAdvisorPassword, mapBackendError } from '@/lib/platformLogin';

// Rate limiter: 5 attempts per 15 minutes per IP
const limiter = rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
});

/**
 * Get client IP from request
 */
function getClientIP(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    const clientIP = getClientIP(request);
    
    // Check rate limit
    try {
        await limiter.check(5, clientIP);
    } catch {
        serverLogger.warn('Rate limit exceeded', { ip: clientIP });
        return NextResponse.json(
            { 
                success: false,
                error: 'RATE_LIMIT_EXCEEDED',
                errorCode: 'tooManyAttempts',
                detail: 'Demasiados intentos. Por favor espere unos minutos.',
            },
            { status: 429 }
        );
    }

    try {
        const data = await request.json();
        
        // Validate required fields
        if (!data.document_number || !data.password || !data.birth_date) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'VALIDATION_ERROR',
                    errorCode: 'missingFields',
                    detail: 'Todos los campos son obligatorios',
                },
                { status: 400 }
            );
        }

        // Parse password format: USER-PASSWORD
        const parsed = splitAdvisorPassword(String(data.password));

        // Validate password format
        if (!parsed) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'VALIDATION_ERROR',
                    errorCode: 'invalidPasswordFormat',
                    detail: 'Formato de contrasena invalido. Use el formato: USUARIO-CLAVE',
                },
                { status: 400 }
            );
        }

        const { user, password } = parsed;

        // Build backend request data matching AttlasInsolvencyAuthSerializer
        const backendData = {
            document_number: data.document_number,
            birth_date: data.birth_date,
            user: user.toUpperCase(),
            password: password,
        };

        const response = await axios.post(
            `${apiBaseUrl}/login/`,
            backendData,
            { headers: djangoHeaders({}, request), timeout: 30000 }
        );

        const { token, expires_in } = response.data;

        const res = NextResponse.json({ 
            success: true,
            message: 'Login exitoso',
        });

        res.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: expires_in,
        });

        serverLogger.info('User login successful', { ip: clientIP });

        return res;

    } catch (error) {
        // Handle axios errors
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 500;
            const errorData = error.response?.data;
            const { code: errorCode, detail } = mapBackendError(errorData, statusCode);
            
            serverLogger.warn('Login failed', { 
                ip: clientIP, 
                errorCode,
                statusCode 
            });
            
            return NextResponse.json(
                { 
                    success: false,
                    error: 'AUTH_ERROR',
                    errorCode,
                    detail,
                },
                { status: statusCode === 500 ? 500 : statusCode === 429 ? 429 : 400 }
            );
        }
        
        // Handle timeout
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            serverLogger.error('Login timeout', { ip: clientIP });
            return NextResponse.json(
                { 
                    success: false,
                    error: 'TIMEOUT',
                    errorCode: 'timeoutError',
                    detail: 'El servidor tardo demasiado en responder',
                },
                { status: 504 }
            );
        }
        
        // Handle network errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            serverLogger.error('Network error during login', { 
                ip: clientIP,
                errorCode: error.code 
            });
            return NextResponse.json(
                { 
                    success: false,
                    error: 'NETWORK_ERROR',
                    errorCode: 'networkError',
                    detail: 'Error de conexion con el servidor',
                },
                { status: 503 }
            );
        }
        
        // Generic error
        serverLogger.error('Login internal error', { 
            ip: clientIP,
            error: error.message 
        });
        return NextResponse.json(
            { 
                success: false,
                error: 'INTERNAL_ERROR',
                errorCode: 'generalError',
                detail: 'Error interno del servidor',
            },
            { status: 500 }
        );
    }
}
