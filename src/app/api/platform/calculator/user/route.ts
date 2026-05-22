// src/app/api/platform/calculator/user/route.ts

import { userIdentificationSchema, userRegistrationSchema } from '@/lib/validation/schemas';
import axios from 'axios';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

/**
 * POST - Buscar usuario por cedula y fecha de nacimiento
 */
export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validar datos de entrada
        const validation = userIdentificationSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'VALIDATION_ERROR',
                    detail: validation.error.errors[0]?.message || 'Datos invalidos'
                },
                { status: 400 }
            );
        }

        const { cedula, birthDate } = validation.data;

        // Buscar usuario en el backend
        const response = await axios.get(
            `${apiBaseUrl}/clients/search/`,
            {
                params: {
                    document_number: cedula,
                    birth_date: birthDate,
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
                cedula: userData.document_number,
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                birthDate: userData.birth_date,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Usuario no encontrado
            if (error.response?.status === 404) {
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
        console.error('Error searching user:', error);
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
 * PUT - Crear o actualizar usuario
 */
export async function PUT(request: Request) {
    try {
        const data = await request.json();

        // Validar datos de entrada
        const validation = userRegistrationSchema.safeParse(data);
        if (!validation.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'VALIDATION_ERROR',
                    detail: validation.error.errors[0]?.message || 'Datos invalidos'
                },
                { status: 400 }
            );
        }

        const userData = validation.data;

        // Crear usuario en el backend
        const response = await axios.post(
            `${apiBaseUrl}/clients/`,
            {
                document_number: userData.cedula,
                birth_date: userData.birthDate,
                first_name: userData.firstName,
                last_name: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                address: userData.address || '',
            },
            { timeout: 10000 }
        );

        const createdUser = response.data;

        return NextResponse.json({
            success: true,
            user: {
                id: createdUser.id,
                cedula: createdUser.document_number,
                firstName: createdUser.first_name,
                lastName: createdUser.last_name,
                email: createdUser.email,
                phone: createdUser.phone,
                address: createdUser.address,
                birthDate: createdUser.birth_date,
            },
        });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Usuario ya existe
            if (error.response?.status === 409) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'USER_EXISTS',
                        detail: 'El usuario ya existe'
                    },
                    { status: 409 }
                );
            }

            // Error de validacion del backend
            if (error.response?.status === 400) {
                return NextResponse.json(
                    { 
                        success: false, 
                        error: 'VALIDATION_ERROR',
                        detail: error.response?.data?.detail || 'Datos invalidos'
                    },
                    { status: 400 }
                );
            }

            // Otros errores
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
        console.error('Error creating user:', error);
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
