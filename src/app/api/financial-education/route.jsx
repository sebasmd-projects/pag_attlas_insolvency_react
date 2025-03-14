import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Realiza la solicitud GET a la API externa
        const response = await axios.get(
            'https://propensionesabogados.com/api/v1/financial-education/'
        );

        if (!response.data) {
            throw new Error('La respuesta de la API no contiene datos.');
        }

        return NextResponse.json(response.data, {
            status: 200,
        });
    } catch (error) {
        console.error('Error en financial-education route:', error.message);

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