// src/app/api/platform/calculator/interest-rate/route.ts

import axios from 'axios';
import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://propensionesabogados.com/api/v1/calculator';

// Default usury rate if backend fails
const DEFAULT_USURA_RATE = 27.14;

/**
 * GET - Obtener la tasa de usura vigente
 * Backend endpoint: GET /interest-rate/
 */
export async function GET() {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/interest-rate/`,
            { timeout: 10000 }
        );

        // El backend devuelve una lista con un solo elemento
        const rateData = Array.isArray(response.data) ? response.data[0] : response.data;
        
        if (rateData && typeof rateData.rate === 'number') {
            return NextResponse.json({
                success: true,
                rate: rateData.rate,
                source: 'backend',
            });
        }

        // Si no hay datos, devolver tasa por defecto
        return NextResponse.json({
            success: true,
            rate: DEFAULT_USURA_RATE,
            source: 'default',
        });

    } catch (error) {
        console.error('Error fetching interest rate:', error);
        
        // En caso de error, devolver tasa por defecto
        return NextResponse.json({
            success: true,
            rate: DEFAULT_USURA_RATE,
            source: 'default',
        });
    }
}
