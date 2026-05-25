// src/app/api/platform/calculator/user/route.ts

import { userIdentificationSchema, userRegistrationSchema } from '@/lib/validation/schemas';
import { validateOrigin, corsErrorResponse } from '@/lib/cors';
import { serverLogger } from '@/lib/logger';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';

/**
 * POST - Buscar usuario por cedula y fecha de nacimiento
 * Backend endpoint: GET /clients/search/?documentNumber=xxx&birthDate=yyyy-mm-dd
 */
export async function POST(request: Request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    try {
        const data = await request.json();

        // Validar datos de entrada
        const validation = userIdentificationSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'VALIDATION_ERROR',
                    detail: validation.error.issues[0]?.message || 'Datos invalidos'
                },
                { status: 400 }
            );
        }

        const { cedula, birthDate } = validation.data;

        // Buscar usuario en el backend - GET /clients/search/
        const response = await axios.get(
            `${apiBaseUrl}/clients/search/`,
            {
                params: {
                    documentNumber: cedula,
                    birthDate: birthDate,
                },
                timeout: 10000,
            }
        );

        const userData = response.data;

        return NextResponse.json({
            success: true,
            found: true,
            user: {
                id: userData.id,
                cedula: userData.documentNumber,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                birthDate: userData.birthDate,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Usuario no encontrado (404 o error de validacion del serializer)
            if (error.response?.status === 404 || error.response?.status === 400) {
                return NextResponse.json({
                    success: true,
                    found: false,
                    user: null,
                });
            }

            // Error de autenticacion o permisos
            if (error.response?.status === 401 || error.response?.status === 403) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'AUTH_ERROR',
                        detail: 'Error de autenticacion'
                    },
                    { status: error.response.status }
                );
            }

            // Otros errores del backend
            serverLogger.error('Error searching user', {
                error: error.message,
                status: error.response?.status,
            });
            
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'BACKEND_ERROR',
                    detail: error.response?.data?.detail || 'Error al buscar usuario'
                },
                { status: error.response?.status || 500 }
            );
        }

        // Error inesperado
        serverLogger.error('Unexpected error searching user', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'INTERNAL_ERROR',
                detail: 'Error interno del servidor'
            },
            { status: 500 }
        );
    }
}

/**
 * PUT - Crear nuevo usuario/cliente
 * Backend endpoint: POST /clients/
 */
export async function PUT(request: Request) {
    // CORS validation
    const { isValid } = validateOrigin(request);
    if (!isValid) {
        return corsErrorResponse();
    }

    try {
        const data = await request.json();

        // Validar datos de entrada
        const validation = userRegistrationSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'VALIDATION_ERROR',
                    detail: validation.error.issues[0]?.message || 'Datos invalidos'
                },
                { status: 400 }
            );
        }

        const userData = validation.data;

        // Crear usuario en el backend - POST /clients/
        const response = await axios.post(
            `${apiBaseUrl}/clients/`,
            {
                documentNumber: userData.cedula,
                birthDate: userData.birthDate,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
            },
            { timeout: 10000 }
        );

        const createdUser = response.data;

        return NextResponse.json({
            success: true,
            user: {
                id: createdUser.id,
                cedula: createdUser.documentNumber,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                email: createdUser.email || '',
                phone: createdUser.phone || '',
                address: createdUser.address || '',
                birthDate: createdUser.birthDate,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Usuario ya existe (el serializer devuelve 400 con error en documentNumber)
            if (error.response?.status === 400) {
                const errorData = error.response?.data;
                
                // Verificar si es error de usuario existente
                if (errorData?.documentNumber) {
                    return NextResponse.json(
                        { 
                            success: false, 
                            error: 'USER_EXISTS',
                            detail: errorData.documentNumber[0] || 'El usuario ya existe'
                        },
                        { status: 409 }
                    );
                }
                
                // Otros errores de validacion
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'VALIDATION_ERROR',
                        detail: errorData?.detail || errorData?.non_field_errors?.[0] || 'Datos invalidos'
                    },
                    { status: 400 }
                );
            }

            // Otros errores
            serverLogger.error('Error creating user', {
                error: error.message,
                status: error.response?.status,
            });
            
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'BACKEND_ERROR',
                    detail: error.response?.data?.detail || 'Error al crear usuario'
                },
                { status: error.response?.status || 500 }
            );
        }

        // Error inesperado
        serverLogger.error('Unexpected error creating user', {
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        return NextResponse.json(
            { 
                success: false, 
                error: 'INTERNAL_ERROR',
                detail: 'Error interno del servidor'
            },
            { status: 500 }
        );
    }
}
