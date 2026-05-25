import axios from 'axios';
import { NextResponse } from 'next/server';
import { apiBaseUrl } from '@/config';
import { serverLogger } from '@/lib/logger';

export async function GET() {
    try {
        const response = await axios.get(
            `${apiBaseUrl}/main-faq/`,
            { timeout: 10000 }
        );

        if (!response.data) {
            throw new Error('La respuesta de la API no contiene datos.');
        }

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        serverLogger.error('Error fetching main FAQ', {
            error: error.message,
            status: error.response?.status,
        });

        return NextResponse.json(
            { detail: error.response?.data?.detail || 'Error al obtener informacion' },
            { status: error.response?.status || 500 }
        );
    }
}
