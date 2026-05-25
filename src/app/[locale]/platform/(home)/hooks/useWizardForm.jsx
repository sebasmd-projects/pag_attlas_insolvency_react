// src/app/[locale]/platform/(home)/hooks/useWizardForm.js

'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { patchStep } from '../services/api';
import Steps from '../steps';
import useLocalUserStorage from './useLocalUserStorage';
import useSessionGuard from './useSessionGuard';

const WizardContext = createContext(null);

// ── Estado inicial (añadimos formId) ───────────────────────────────────────────
const initialState = {
    data: {},
    stepIndex: 0,
    isSubmitting: false,
    formId: null,
};

// ── Reducer ────────────────────────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: { ...state.data, ...action.payload } };
        case 'SET_FORM_ID':
            return { ...state, formId: action.payload };
        case 'NEXT':
            return { ...state, stepIndex: state.stepIndex + 1 };
        case 'BACK':
            return { ...state, stepIndex: Math.max(state.stepIndex - 1, 0) };
        case 'SUBMIT_START':
            return { ...state, isSubmitting: true };
        case 'SUBMIT_END':
            return { ...state, isSubmitting: false };
        default:
            return state;
    }
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function WizardProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const router = useRouter();
    const { isSessionValid } = useSessionGuard();

    // ────────────────────────────────────────────────────────────────────────────
    // 1 · Identificador del usuario y datos del token (unificado)
    // ────────────────────────────────────────────────────────────────────────────
    const [userId, setUserId] = useState(null);
    const [tokenData, setTokenData] = useState(null);

    useEffect(() => {
        fetch('/api/platform/auth/token-info', { 
            cache: 'no-store',
            credentials: 'include' 
        })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data) {
                    setUserId(data.document_number || 'anon');
                    setTokenData(data);
                } else {
                    setUserId('anon');
                }
            })
            .catch(() => setUserId('anon'));
    }, []);

    // ────────────────────────────────────────────────────────────────────────────
    // 2 · Persistencia ligada al usuario
    // ────────────────────────────────────────────────────────────────────────────
    const [persistedState, setPersistedState, isPersistedLoaded] = useLocalUserStorage(
        userId ? `wizard-${userId}` : null,
        initialState
    );

    // ────────────────────────────────────────────────────────────────────────────
    // 3 · REHIDRATACION: PRIMERO BD, SINO LOCALSTORAGE
    // ────────────────────────────────────────────────────────────────────────────
    const hydratedRef = useRef(false);
    useEffect(() => {
        if (hydratedRef.current || !userId) return;
        hydratedRef.current = true;

        (async () => {
            if (!persistedState?.formId) {
                if (persistedState?.data) {
                    dispatch({ type: 'SET_DATA', payload: persistedState.data });
                }
                return;
            }

            try {
                // Use authenticated proxy endpoint with cookies
                const res = await fetch(
                    `/api/platform/insolvency-form/fetch?formId=${persistedState.formId}&step=0`,
                    { 
                        cache: 'no-store',
                        credentials: 'include'
                    }
                );

                if (res.status === 401) {
                    router.push('/platform/auth/login');
                    return;
                }

                if (!res.ok) throw new Error('Failed to fetch form data');

                const serverData = await res.json();

                // Combinar datos manteniendo preferencia por el servidor
                const mergedData = {
                    ...persistedState.data,
                    ...serverData
                };

                dispatch({
                    type: 'SET_DATA',
                    payload: mergedData
                });

                // Sincronizar localStorage
                setPersistedState(prev => ({
                    ...prev,
                    data: mergedData
                }));

            } catch {
                // Fallback a localStorage
                if (persistedState?.data) {
                    dispatch({ type: 'SET_DATA', payload: persistedState.data });
                }
            }
        })();
    }, [userId, persistedState, setPersistedState, router]); // se dispara solo cuando conocemos el userId

    // ────────────────────────────────────────────────────────────────────────────
    // 4 · Persistencia hacia localStorage (igual que antes)
    // ────────────────────────────────────────────────────────────────────────────
    const debounceRef = useRef();
    useEffect(() => {
        if (!userId) return;
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setPersistedState(state), 300);
    }, [state, userId, setPersistedState]);

    // ────────────────────────────────────────────────────────────────────────────
    // 5 · Cargar datos del usuario desde tokenData (edad, doc, etc.) - sin fetch duplicado
    // ────────────────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (tokenData?.document_number && tokenData?.birth_date) {
            const birth = new Date(tokenData.birth_date);
            const today = new Date();
            let debtor_age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) debtor_age--;
            dispatch({
                type: 'SET_DATA',
                payload: {
                    debtor_document_number: tokenData.document_number,
                    debtor_birth_date: tokenData.birth_date,
                    debtor_age: debtor_age
                },
            });
        }
    }, [tokenData]);

    // ────────────── Helpers del wizard ──────────────────────────────────────────
    const steps = Steps;
    const StepComponent = steps[state.stepIndex];

    const updateData = useCallback(
        (partial) => dispatch({ type: 'SET_DATA', payload: partial }),
        []
    );

    // ────────────────────────────────────────────────────────────────────────────
    // NEXT → envío de paso al backend
    // ────────────────────────────────────────────────────────────────────────────
    const handleNext = useCallback(
        async (stepData) => {
            if (!(await isSessionValid())) return;

            // Mezclamos la data local antes de llamar al backend
            dispatch({ type: 'SET_DATA', payload: stepData });

            const nextStep = state.stepIndex + 1;

            dispatch({ type: 'SUBMIT_START' });
            try {
                const serverResp = await patchStep({
                    formId: state.formId,
                    step: state.stepIndex + 1,
                    body: stepData,
                });

                // Guardamos el ID de formulario si aún no lo teníamos
                if (!state.formId && serverResp?.id) {
                    dispatch({ type: 'SET_FORM_ID', payload: serverResp.id });
                }

                // ¿Último paso?
                if (nextStep >= steps.length) {
                    toast.success('Formulario enviado con éxito');
                    router.push('/');
                } else {
                    dispatch({ type: 'NEXT' });
                }
            } catch (err) {
                toast.error(err.message || 'Error al guardar el formulario');
            } finally {
                dispatch({ type: 'SUBMIT_END' });
            }
        },
        [
            isSessionValid,
            router,
            state.formId,
            state.stepIndex,
            steps.length,
        ]
    );

    const handleBack = useCallback(() => dispatch({ type: 'BACK' }), []);

    // 7. Valor expuesto
    const value = useMemo(
        () => ({
            ...state,
            steps,
            StepComponent,
            handleNext,
            handleBack,
            updateData,
        }),
        [state, steps, StepComponent, handleNext, handleBack, updateData]
    );

    return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

// ── Hook de consumo ───────────────────────────────────────────────────────────
export function useWizard() {
    return useContext(WizardContext);
}
