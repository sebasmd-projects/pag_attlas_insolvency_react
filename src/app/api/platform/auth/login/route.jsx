// src/app/api/platform/auth/login/route.jsx

import axios from 'axios';
import { NextResponse } from 'next/server';
import rateLimit from '@/components/lib/rate-limit';

// Rate limiter: 5 attempts per 15 minutes per IP
const limiter = rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
});

// Error codes mapping from backend serializer
// Backend returns errors in format: { field_name: ['error message'] }
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
 * Backend serializer returns errors in format:
 * - { document_number: ['Cédula no encontrada con esa fecha de nacimiento.'] }
 * - { user: ['Asesor inválido. No existe un asesor con las iniciales proporcionadas.'] }
 * - { password: ['Contraseña incorrecta para el asesor indicado.'] }
 */
function mapBackendError(errorData, statusCode) {
    // Check for specific field errors from Django serializer
    if (errorData) {
        // Document number / birth date error
        if (errorData.document_number) {
            const msg = Array.isArray(errorData.document_number) 
                ? errorData.document_number[0] 
                : errorData.document_number;
            if (msg.toLowerCase().includes('fecha')) {
                return { code: ERROR_CODES.INVALID_BIRTH_DATE, detail: msg };
            }
            return { code: ERROR_CODES.USER_NOT_FOUND, detail: msg };
        }
        
        // Advisor (user) error
        if (errorData.user) {
            const msg = Array.isArray(errorData.user) 
                ? errorData.user[0] 
                : errorData.user;
            return { code: ERROR_CODES.INVALID_ADVISOR, detail: msg };
        }
        
        // Password error
        if (errorData.password) {
            const msg = Array.isArray(errorData.password) 
                ? errorData.password[0] 
                : errorData.password;
            return { code: ERROR_CODES.INVALID_CREDENTIALS, detail: msg };
        }
        
        // Non-field errors
        if (errorData.non_field_errors) {
            const msg = Array.isArray(errorData.non_field_errors) 
                ? errorData.non_field_errors[0] 
                : errorData.non_field_errors;
            return { code: 'generalError', detail: msg };
        }

        // Detail message (generic)
        if (errorData.detail) {
            return { code: 'generalError', detail: errorData.detail };
        }
    }
    
    // Default for 400/401 errors
    if (statusCode === 400 || statusCode === 401) {
        return { code: ERROR_CODES.INVALID_CREDENTIALS, detail: 'Credenciales inválidas' };
    }
    
    return { code: 'generalError', detail: 'Error de autenticación' };
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

        // Parse password format: USER-PASSWORD
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

        // Build backend request data matching AttlasInsolvencyAuthSerializer
        const backendData = {
            document_number: data.document_number,
            birth_date: data.birth_date,
            user: user.toUpperCase(), // Asesor initials in uppercase
            password: password,
        };

        const response = await axios.post(
            'https://propensionesabogados.com/api/v1/login/',
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
            const errorData = error.response?.data;
            const { code: errorCode, detail } = mapBackendError(errorData, statusCode);
            
            return NextResponse.json(
                { 
                    success: false,
                    error: 'AUTH_ERROR',
                    errorCode,
                    detail,
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
