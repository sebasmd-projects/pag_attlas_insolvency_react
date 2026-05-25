// src/lib/cors.ts
// CORS origin validation utility for API routes

import { NextResponse } from 'next/server';

// Allowed origins for API requests
const ALLOWED_ORIGINS = [
    'https://fundacionattlas.org',
    'https://www.fundacionattlas.org',
    'https://fundacionattlas.com',
    'https://www.fundacionattlas.com',
    // Development origins
    ...(process.env.NODE_ENV === 'development' ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://192.168.101.29:3000',
    ] : []),
];

// Vercel preview URLs pattern
const VERCEL_PREVIEW_PATTERN = /^https:\/\/.*\.vercel\.app$/;

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;
    
    // Allow exact matches
    if (ALLOWED_ORIGINS.includes(origin)) return true;
    
    // Allow Vercel preview deployments
    if (VERCEL_PREVIEW_PATTERN.test(origin)) return true;
    
    return false;
}

/**
 * Validate origin and return appropriate response headers
 */
export function validateOrigin(request: Request): {
    isValid: boolean;
    origin: string | null;
    headers: Headers;
} {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const headers = new Headers();
    
    // For same-origin requests (no origin header), allow
    if (!origin) {
        // Check referer as fallback for same-origin
        if (referer) {
            try {
                const refererUrl = new URL(referer);
                const refererOrigin = refererUrl.origin;
                if (isOriginAllowed(refererOrigin)) {
                    return { isValid: true, origin: refererOrigin, headers };
                }
            } catch {
                // Invalid referer URL
            }
        }
        // Allow requests without origin (same-origin, server-to-server, etc.)
        return { isValid: true, origin: null, headers };
    }
    
    const isValid = isOriginAllowed(origin);
    
    if (isValid) {
        headers.set('Access-Control-Allow-Origin', origin);
        headers.set('Access-Control-Allow-Credentials', 'true');
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
    
    return { isValid, origin, headers };
}

/**
 * Create a CORS error response
 */
export function corsErrorResponse(): NextResponse {
    return NextResponse.json(
        { 
            success: false, 
            error: 'CORS_ERROR',
            detail: 'Origin not allowed' 
        },
        { status: 403 }
    );
}

/**
 * Handle preflight OPTIONS request
 */
export function handlePreflight(request: Request): NextResponse | null {
    if (request.method !== 'OPTIONS') return null;
    
    const { isValid, headers } = validateOrigin(request);
    
    if (!isValid) {
        return corsErrorResponse();
    }
    
    headers.set('Access-Control-Max-Age', '86400'); // 24 hours
    
    return new NextResponse(null, {
        status: 204,
        headers,
    });
}

/**
 * Middleware wrapper for CORS validation
 * Use this in API routes that need CORS protection
 */
export function withCorsValidation<T extends (...args: unknown[]) => Promise<NextResponse>>(
    handler: T
): T {
    return (async (...args: Parameters<T>) => {
        const request = args[0] as Request;
        
        // Handle preflight
        const preflightResponse = handlePreflight(request);
        if (preflightResponse) return preflightResponse;
        
        // Validate origin
        const { isValid, headers } = validateOrigin(request);
        
        if (!isValid) {
            return corsErrorResponse();
        }
        
        // Call the original handler
        const response = await handler(...args);
        
        // Add CORS headers to response
        headers.forEach((value, key) => {
            response.headers.set(key, value);
        });
        
        return response;
    }) as T;
}
