// src/app/[locale]/platform/hooks/useCreditors.js
//
// Hook compartido entre Step5Creditors y VerifyCompliment.
// Fuente única de verdad: SIEMPRE lee y escribe en el endpoint del step 5.
//
// Modelo canónico (almacenado en el servidor):
// {
//   id?, creditor, nit, creditor_contact,
//   nature_type, other_nature,
//   personal_credit_interest_rate, personal_consanguinity,
//   guarantee, capital_value (number), days_overdue (number),
//   credit_classification
// }
//
// VerifyCompliment solo necesita: name→creditor, nature→nature_type,
// other_nature, capital_value, days_overdue.
// Los campos que VerifyCompliment no conoce se guardan como 'TODO' cuando
// el registro proviene de la calculadora.

'use client';

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/* ─── Constantes ──────────────────────────────────────────────── */
export const EXCLUDED_NATURES = ['CRÉDITO DE LIBRANZA', 'CRÉDITO DE NOMINA'];

export const NATURE_OPTIONS = [
    'CRÉDITO DE LIBRANZA',
    'CRÉDITO DE NOMINA',
    'CRÉDITO HIPOTECARIO',
    'CRÉDITO DE GARANTÍA MOBILIARIA',
    'CRÉDITO FISCAL O TRIBUTARIO',
    'CRÉDITO DE LIBRE INVERSION',
    'CRÉDITO PERSONAL',
    'CRÉDITO COMERCIAL',
    'CRÉDITO ROTATIVO',
    'CRÉDITO EDUCATIVO O DE ESTUDIO',
    'CRÉDITO DE CONSUMO',
    'OTRO',
];

export const NATURE_OPTIONS_SIMPLE = [
    ['CRÉDITO DE LIBRANZA', 'Libranza'],
    ['CRÉDITO HIPOTECARIO', 'Hipotecario'],
    ['CRÉDITO CON GARANTÍA MOBILIARIA', 'Garantía mobiliaria'],
    ['CRÉDITO FISCAL O TRIBUTARIO', 'Fiscal / tributario'],
    ['CRÉDITO DE LIBRE INVERSIÓN', 'Libre inversión'],
    ['CRÉDITO DE NOMINA', 'Nómina'],
    ['CRÉDITO PERSONAL', 'Personal'],
    ['CRÉDITO COMERCIAL', 'Comercial'],
    ['CRÉDITO ROTATIVO', 'Rotativo'],
    ['CRÉDITO EDUCATIVO O DE ESTUDIO', 'Educativo'],
    ['CRÉDITO DE CONSUMO', 'Consumo'],
    ['OTRO', 'Otro'],
]

export const CONSANGUINITY_OPTIONS = [
    ['NN', 'No tengo parentesco'],
    ['1C', '1° consanguíneo: Compañero/a permanente, Padres e Hijos'],
    ['2C', '2° consanguíneo: Abuelos, Nietos y Hermanos'],
    ['3C', '3° consanguíneo: Tíos y Sobrinos'],
    ['4C', '4° consanguíneo: Primos y Sobrinos (nietos)'],
    ['1A', '1° afinidad: Suegros y Yerno/Nuera'],
    ['2A', '2° afinidad: Abuelos, Nietos y Hermanos del compañero/a permanente'],
    ['1CIV', '1° civil: Hijos adoptados y Padres Adoptivos'],
];

export const EMPTY_CREDITOR = {
    creditor: '',
    nit: '',
    creditor_contact: '',
    nature_type: '',
    other_nature: '',
    personal_credit_interest_rate: '',
    personal_consanguinity: '',
    guarantee: '',
    capital_value: '',
    days_overdue: '',
    credit_classification: '',
};

/* ─── Helpers de formato ──────────────────────────────────────── */
export const toFmt = (v) =>
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(v || 0);

export const toNum = (v) =>
    parseFloat(String(v || '0').replace(/,/g, '')) || 0;

export function formatLocale(value) {
    const n = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(n)) return '';
    return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n);
}

export function parseLocale(value) {
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

/* ─── Mapeo bidireccional ─────────────────────────────────────── */

/**
 * Convierte el modelo canónico del servidor al shape simple que usa VerifyCompliment.
 * VerifyCompliment trabaja con: name, nature, other_nature, capital_value, days_overdue.
 */
export function toSimpleCreditor(canonical) {
    return {
        // Preservamos el id para poder hacer PATCH correcto
        _canonicalId: canonical.id,
        name: canonical.creditor ?? '',
        nature: canonical.nature_type ?? '',
        other_nature: canonical.other_nature ?? '',
        capital_value: canonical.capital_value != null
            ? String(canonical.capital_value)
            : '',
        days_overdue: canonical.days_overdue != null
            ? String(canonical.days_overdue)
            : '',
    };
}

/**
 * Convierte el shape simple de VerifyCompliment al modelo canónico,
 * mezclando con los datos existentes (si los hay) para no perder
 * campos como nit, guarantee, etc.
 * Los campos que VerifyCompliment no gestiona se fijan a 'TODO' solo
 * cuando el registro es nuevo (no tiene datos previos).
 */
export function mergeSimpleToCanonical(simple, existingCanonical = null) {
    const base = existingCanonical ?? {
        nit: 'TODO',
        creditor_contact: 'TODO',
        personal_credit_interest_rate: 'TODO',
        personal_consanguinity: 'TODO',
        guarantee: 'TODO',
        credit_classification: 'TODO',
        other_nature: '',
    };

    return {
        ...base,
        // Campos que VerifyCompliment gestiona directamente
        creditor: simple.name ?? base.creditor ?? 'TODO',
        nature_type: simple.nature ?? base.nature_type ?? 'TODO',
        other_nature: simple.other_nature ?? base.other_nature ?? '',
        capital_value: toNum(simple.capital_value),
        days_overdue: parseInt(simple.days_overdue, 10) || 0,
        // Preservamos el id original si existe
        ...(simple._canonicalId != null ? { id: simple._canonicalId } : {}),
    };
}

/* ─── API calls ───────────────────────────────────────────────── */
async function fetchCreditors() {
    const { data } = await axios.get('/api/platform/insolvency-form/get-data/?step=5');
    return data?.creditors ?? [];
}

async function saveCreditors(creditors) {
    const payload = {
        creditors: creditors.map((c) => ({
            ...c,
            capital_value: toNum(c.capital_value),
            days_overdue: parseInt(c.days_overdue, 10) || 0,
        })),
    };
    return axios.patch('/api/platform/insolvency-form/?step=5', payload);
}

/* ─── Métricas de cumplimiento ────────────────────────────────── */
export function computeMetrics(creditors) {
    const m = {
        withEx: { total: 0, arrears: 0 },
        noEx: { total: 0, arrears: 0, severeArrears: 0, severeCount: 0 },
    };

    creditors.forEach((c) => {
        const capital = toNum(c.capital_value);
        const days = parseInt(c.days_overdue, 10) || 0;
        const excluded = EXCLUDED_NATURES.includes(c.nature_type);

        m.withEx.total += capital;
        if (days > 0) m.withEx.arrears += capital;

        if (!excluded) {
            m.noEx.total += capital;
            if (days > 0) m.noEx.arrears += capital;
            if (days >= 90) {
                m.noEx.severeArrears += capital;
                m.noEx.severeCount += 1;
            }
        }
    });

    m.withEx.current = m.withEx.total - m.withEx.arrears;
    m.noEx.current = m.noEx.total - m.noEx.arrears;
    m.noEx.pct = m.noEx.total ? (m.noEx.severeArrears / m.noEx.total) * 100 : 0;

    return m;
}

/* ─── Hook principal ──────────────────────────────────────────── */
/**
 * @param {object} options
 * @param {function} [options.onSaveSuccess]
 * @param {function} [options.onSaveError]
 */
export function useCreditors({ onSaveSuccess, onSaveError } = {}) {
    const queryClient = useQueryClient();

    const { data: creditors = [], isLoading } = useQuery({
        queryKey: ['step5Creditors'],
        queryFn: fetchCreditors,
        refetchOnMount: true,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });

    const mutation = useMutation({
        mutationFn: saveCreditors,
        onSuccess: () => {
            queryClient.invalidateQueries(['step5Creditors']);
            onSaveSuccess?.();
        },
        onError: onSaveError,
    });

    /** Guarda la lista canónica completa */
    const save = useCallback(
        (list) => mutation.mutate(list),
        [mutation]
    );

    /**
     * Guarda desde VerifyCompliment:
     * mezcla la lista simple con los canónicos existentes, rellenando TODO donde falte.
     */
    const saveFromSimple = useCallback(
        (simpleList) => {
            const canonical = simpleList.map((simple) => {
                const existing = creditors.find((c) => c.id === simple._canonicalId) ?? null;
                return mergeSimpleToCanonical(simple, existing);
            });
            mutation.mutate(canonical);
        },
        [mutation, creditors]
    );

    return {
        /** Lista en formato canónico (para Step5) */
        creditors,
        isLoading,
        isSaving: mutation.isPending,
        save,
        saveFromSimple,
    };
}