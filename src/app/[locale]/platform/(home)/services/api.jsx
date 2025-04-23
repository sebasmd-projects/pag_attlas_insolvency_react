// src/app/[locale]/platform/(home)/services/api.js

export async function patchStep({ formId, step, body }) {
    // 1. Obtener token de autenticación
    const token = localStorage.getItem('access_token');

    // 2. Construcción de URL según documentación
    const baseURL = formId
        ? `/api/platform/insolvency-form/${formId}`
        : '/api/platform/insolvency-form/';

    // 3. Configurar cabeceras con autenticación
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
        const res = await fetch(`${baseURL}/?step=${step}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });

        // 4. Manejar sesión expirada
        if (res.status === 401) {
            localStorage.removeItem('access_token');
            throw new Error('Sesión expirada - Por favor vuelve a iniciar sesión');
        }

        // 5. Manejo de errores HTTP
        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            throw new Error(
                errorData?.detail ||
                errorData?.message ||
                `Error en paso ${step} (${res.status})`
            );
        }

        // 6. Retornar datos actualizados
        return await res.json();

    } catch (error) {
        // 7. Manejo de errores de red/parseo
        console.error('Error en patchStep:', error);
        throw new Error(
            error.message ||
            'Error de conexión - Verifica tu acceso a internet'
        );
    }
}