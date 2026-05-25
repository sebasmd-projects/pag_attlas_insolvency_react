// src/app/api/platform/auth/login/route.jsx

import rateLimit from '@/components/lib/rate-limit';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

// Rate limiter: 5 attempts per 15 minutes per IP
const limiter = rateLimit({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 500,
});

// Error codes mapping from backend serializer
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
function mapBackendError(errorData, statusCode) {
    if (errorData) {
        if (errorData.document_number) {
            const msg = Array.isArray(errorData.document_number) 
                ? errorData.document_number[0] 
                : errorData.document_number;
            if (msg.toLowerCase().includes('fecha')) {
                return { code: ERROR_CODES.INVALID_BIRTH_DATE, detail: msg };
            }
            return { code: ERROR_CODES.USER_NOT_FOUND, detail: msg };
        }
        
        if (errorData.user) {
            const msg = Array.isArray(errorData.user) 
                ? errorData.user[0] 
                : errorData.user;
            return { code: ERROR_CODES.INVALID_ADVISOR, detail: msg };
        }
        
        if (errorData.password) {
            const msg = Array.isArray(errorData.password) 
                ? errorData.password[0] 
                : errorData.password;
            return { code: ERROR_CODES.INVALID_CREDENTIALS, detail: msg };
        }
        
        if (errorData.non_field_errors) {
            const msg = Array.isArray(errorData.non_field_errors) 
                ? errorData.non_field_errors[0] 
                : errorData.non_field_errors;
            return { code: 'generalError', detail: msg };
        }

        if (errorData.detail) {
            return { code: 'generalError', detail: errorData.detail };
        }
    }
    
    if (statusCode === 400 || statusCode === 401) {
        return { code: ERROR_CODES.INVALID_CREDENTIALS, detail: 'Credenciales invalidas' };
    }
    
    return { code: 'generalError', detail: 'Error de autenticacion' };
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
        const [user, password] = data.password.split('-');
        
        // Validate password format
        if (!user || !password) {
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
                { status: statusCode === 500 ? 500 : 400 }
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
