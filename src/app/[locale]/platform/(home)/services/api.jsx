// src/app/[locale]/platform/(home)/services/api.js

export async function patchStep({ formId, step, body }) {

    const baseURL = formId
        ? `/api/platform/insolvency-form/${formId}`
        : '/api/platform/insolvency-form/';

    const res = await fetch(`${baseURL}/?step=${step}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    // Sesión expirada
    if (res.status === 401) {
        throw new Error('Sesión expirada - Por favor vuelve a iniciar sesión');
    }

    // Error HTTP
    if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
            errorData?.detail ||
            errorData?.message ||
            `Error en paso ${step} (${res.status})`
        );
    }

    return await res.json();
}
