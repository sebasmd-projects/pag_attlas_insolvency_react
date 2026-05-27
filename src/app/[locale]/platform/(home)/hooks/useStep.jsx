// src/app/[locale]/platform/(home)/hooks/useStep.jsx

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

export function useStep({ stepNumber, buildInitial, updateData, onNext }) {

  const t = useTranslations(`Platform.pages.home.wizard.steps.step${stepNumber}`);
  const queryClient = useQueryClient();

  const { data: serverData } = useQuery({
    queryKey: [`step${stepNumber}Data`],
    queryFn: () => axios
      .get(`/api/platform/insolvency-form/get-data/?step=${stepNumber}`)
      .then(r => r.data),
    refetchOnMount: true,
    staleTime: 0,
    refetchOnWindowFocus: false
  });

  const [form, setForm] = useState(() => buildInitial(undefined));

  useEffect(() => {
    if (!serverData) return;
    const initial = buildInitial(serverData);
    setForm(initial);
    updateData?.(initial);
  }, [serverData]);

  const saveMutation = useMutation({
    mutationFn: () => axios
      .patch(
        `/api/platform/insolvency-form/?step=${stepNumber}`,
        form
      ),
    onSuccess: () => {
      toast.success(t('messages.saveSuccess'));
      queryClient.invalidateQueries([`step${stepNumber}Data`]);
    },
    onError: () => toast.error(t('messages.saveError')),
  });

  const handleChange = useCallback(
    (e) => {
      const { name, type, checked, value } = e.target;
      const next = { ...form, [name]: type === 'checkbox' ? checked : value };
      setForm(next);
      updateData?.(next);
    },
    [form, updateData]
  );

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onNext?.(form);
  }, [form, onNext]);


  return {
    form,
    setForm,
    serverData,
    t,
    handleChange,
    handleSubmit,
    handleSave: () => saveMutation.mutate(),
    saveLoading: saveMutation.isPending,
  };
}