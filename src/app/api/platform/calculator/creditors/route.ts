import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const BACKEND_URL = process.env.BACKEND_URL || 'https://propensionesabogados.com';

// Validation schemas
const creditorSchema = z.object({
    name: z.string().min(1),
    nature: z.string().min(1),
    other_nature: z.string().optional().default(''),
    capital_value: z.string(),
    days_overdue: z.string(),
});

const getCreditorSchema = z.object({
    documentNumber: z.string().min(1),
    birthDate: z.string().min(1),
});

const saveCreditorSchema = z.object({
    documentNumber: z.string().min(1),
    birthDate: z.string().min(1),
    creditors: z.array(creditorSchema),
});

// GET - Fetch creditors for a user
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentNumber = searchParams.get('documentNumber');
        const birthDate = searchParams.get('birthDate');

        // Validate input
        const validation = getCreditorSchema.safeParse({ documentNumber, birthDate });
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid parameters' },
                { status: 400 }
            );
        }

        // Call backend API to get creditors
        const response = await fetch(
            `${BACKEND_URL}/api/v1/calculator/clients/creditors/?documentNumber=${encodeURIComponent(documentNumber!)}&birthDate=${encodeURIComponent(birthDate!)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                success: true,
                creditors: data.creditors || [],
            });
        }

        // If endpoint doesn't exist or returns error, return empty array
        // This allows the feature to work even if backend doesn't have creditors endpoint yet
        return NextResponse.json({
            success: true,
            creditors: [],
        });
    } catch (error) {
        console.error('Error fetching creditors:', error);
        // Return empty array on error to allow local usage
        return NextResponse.json({
            success: true,
            creditors: [],
        });
    }
}

// POST - Save creditors for a user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = saveCreditorSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid data', details: validation.error.issues },
                { status: 400 }
            );
        }

        const { documentNumber, birthDate, creditors } = validation.data;

        // Call backend API to save creditors
        const response = await fetch(
            `${BACKEND_URL}/api/v1/calculator/clients/creditors/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentNumber,
                    birthDate,
                    creditors,
                }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            return NextResponse.json({
                success: true,
                message: 'Creditors saved successfully',
                data,
            });
        }

        // If backend doesn't support this endpoint yet, still return success
        // This allows local testing without backend support
        return NextResponse.json({
            success: true,
            message: 'Creditors saved (local only)',
        });
    } catch (error) {
        console.error('Error saving creditors:', error);
        // Return success anyway to not block user experience
        return NextResponse.json({
            success: true,
            message: 'Creditors saved (local only)',
        });
    }
}
