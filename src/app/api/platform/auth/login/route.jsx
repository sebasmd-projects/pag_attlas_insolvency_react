// src/app/api/platform/auth/login/route.jsx

import rateLimit from '@/components/lib/rate-limit';
import axios from 'axios';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

// Rate limiter: 5 attempts per 15 minutes per IP
const limiter = rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
});

// Error codes mapping from backend
const ERROR_CODES = {
    USER_NOT_FOUND: 'userNotFound',
    INVALID_BIRTH_DATE: 'invalidBirthDate',
    INVALID_CREDENTIALS: 'invalidCredentials',
    INVALID_ADVISOR: 'invalidAdvisor',
    ACCOUNT_LOCKED: 'accountLocked',
    ACCOUNT_DISABLED: 'accountDisabled',
};

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

/**
 * Map backend error to frontend error code
 */
function mapBackendError(errorDetail, statusCode) {
    const detail = (errorDetail || '').toLowerCase();
    
    // Check for specific error patterns from the backend
    if (detail.includes('no encontrado') || detail.includes('not found') || detail.includes('no existe')) {
        return ERROR_CODES.USER_NOT_FOUND;
    }
    
    if (detail.includes('fecha') || detail.includes('birth') || detail.includes('nacimiento')) {
        return ERROR_CODES.INVALID_BIRTH_DATE;
    }
    
    if (detail.includes('asesor') || detail.includes('advisor') || detail.includes('consultor')) {
        return ERROR_CODES.INVALID_ADVISOR;
    }
    
    if (detail.includes('bloqueada') || detail.includes('locked') || detail.includes('suspendida')) {
        return ERROR_CODES.ACCOUNT_LOCKED;
    }
    
    if (detail.includes('deshabilitada') || detail.includes('disabled') || detail.includes('inactiva')) {
        return ERROR_CODES.ACCOUNT_DISABLED;
    }
    
    // Default to invalid credentials for 400/401 errors
    if (statusCode === 400 || statusCode === 401) {
        return ERROR_CODES.INVALID_CREDENTIALS;
    }
    
    return 'generalError';
}

export async function POST(request) {
    const clientIP = getClientIP(request);
    
    // Check rate limit
    try {
        await limiter.check(5, clientIP); // 5 requests per interval
    } catch {
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

        const [user, password] = data.password.split('-');
        
        // Validate password format
        if (!user || !password) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'VALIDATION_ERROR',
                    errorCode: 'invalidPasswordFormat',
                    detail: 'Formato de contraseña inválido. Use el formato: USUARIO-CLAVE',
                },
                { status: 400 }
            );
        }

        const backendData = {
            user: user.toUpperCase(),
            password,
            birth_date: data.birth_date,
            document_number: data.document_number,
        };

        const response = await axios.post(
            `${apiBaseUrl}/login/`,
            backendData,
            { timeout: 30000 }
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

        return res;

    } catch (error) {
        // Handle axios errors
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status || 500;
            const errorDetail = error.response?.data?.detail || error.message;
            const errorCode = mapBackendError(errorDetail, statusCode);
            
            return NextResponse.json(
                { 
                    success: false,
                    error: 'AUTH_ERROR',
                    errorCode,
                    detail: errorDetail,
                },
                { status: statusCode === 500 ? 500 : 400 }
            );
        }
        
        // Handle timeout
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'TIMEOUT',
                    errorCode: 'timeoutError',
                    detail: 'El servidor tardó demasiado en responder',
                },
                { status: 504 }
            );
        }
        
        // Handle network errors
        if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { 
                    success: false,
                    error: 'NETWORK_ERROR',
                    errorCode: 'networkError',
                    detail: 'Error de conexión con el servidor',
                },
                { status: 503 }
            );
        }
        
        // Generic error
        console.error('Login error:', error);
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
