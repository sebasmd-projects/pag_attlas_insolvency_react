import axios from 'axios';
import { NextResponse } from 'next/server';
import {apiBaseUrl} from '@/config';

export async function GET() {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/other-faq/`
        );

        if (!response.data) {
            throw new Error('La respuesta de la API no contiene datos.');
        }

        return NextResponse.json(response.data, {
            status: 200,
        });
    } catch (error) {
        console.error('Error en FAQ route:', error.message);

        return NextResponse.json(
            {
                detail:
                    error.response?.data?.detail ||
                    'Error al recibir la información de la API externa.',
            },
            {
                status: error.response?.status || 500,
            }
        );
    }
}