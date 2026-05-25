## 1. DEUDA TÉCNICA IDENTIFICADA (basada en la estructura actual)

| Nivel | Descripción | Impacto | Recomendación |
|-------|-------------|---------|----------------|
| **ALTA** | Extraer [useStep](#usestep) | Mantenibilidad | Elimina 70% de código repetido |
| **ALTA** | Gestión única de [moneda y números](#gestión-de-moneda-y-números) | Mantenibilidad | Elimina 70% de código repetido |
| **ALTA** | Extraer Step10 en componentes más pequeños | Mantenibilidad | Ejm: ExpenseTable, AddDependentForm, FoodObligationSelector, ProposedMonthlyInput |
| **MEDIA** | Manejar [errores de red y sesión de forma global](#errores-de-red-y-sesiones-globales) | Mantenibilidad | patchStep con un interceptor de axios que maneje 401 y refresque token o redirija. |
| **MEDIA** | Optimizaciones de rendimiento | Rendimiento | <ol><li>Memoizar componentes de paso: cada paso es un componente grande, envolverlo con React.memo.</li><li>Usar useCallback estable en handlers: en Step5Creditors, handleChange se recrea en cada render; usa useCallback con dependencias correctas.</li><li>Evitar useEffect que actualiza el estado padre en cada cambio: el useEffect que llama a updateData en cada render del paso es pesado.</li></ol> |
| **MEDIA** | Mejorar la navegación y validación | Validación | Agregar un mecanismo de validación por paso que se ejecute antes de onNext. Define un esquema Zod para cada paso y valida antes de enviar. |
| **BAJO** | Comentarios en español mezclados con código | Mantenibilidad | Estandarizar idioma |
| **BAJO** | PropTypes en lugar de TypeScript en algunos componentes | Type Safety | Migrar a TypeScript |
| **BAJO** | `saveMutation.isLoading` deprecado en React Query v5 | Modernización | Usar `saveMutation.isPending` |

---

### useStep

```js
// hooks/useStep.js
export function useStep({ stepNumber, getEndpoint, patchEndpoint, buildInitial, deps = [] }) {
  const t = useTranslations(`Platform.pages.home.wizard.steps.step${stepNumber}`);
  const queryClient = useQueryClient();
  const { data: serverData } = useQuery({
    queryKey: [`step${stepNumber}Data`],
    queryFn: () => axios.get(getEndpoint).then(r => r.data),
    refetchOnMount: true,
  });

  const [form, setForm] = useState(() => buildInitial(serverData));
  const initialized = useRef(false);

  useEffect(() => {
    if (serverData && !initialized.current) {
      setForm(buildInitial(serverData));
      initialized.current = true;
    }
  }, [serverData]);

  const saveMutation = useMutation({
    mutationFn: () => axios.patch(patchEndpoint, form),
    onSuccess: () => {
      toast.success(t('messages.saveSuccess'));
      queryClient.invalidateQueries([`step${stepNumber}Data`]);
    },
    onError: () => toast.error(t('messages.saveError'))
  });

  const handleSave = () => saveMutation.mutate();
  const handleSubmit = (e) => {
    e.preventDefault();
    return form; // el padre llama a onNext con esto
  };

  return { form, setForm, handleSave, handleSubmit, saveLoading: saveMutation.isLoading, serverData };
}

// Ejemplo Step2:
export default function Step2PersonalData({ updateData, onNext }) {
  const buildInitial = (server) => ({
    debtor_document_number: server?.debtor_document_number ?? '',
    debtor_first_name: server?.debtor_first_name ?? '',
    // ... etc
  });

  const { form, setForm, handleSave, handleSubmit, saveLoading } = useStep({
    stepNumber: 2,
    getEndpoint: '/api/platform/insolvency-form/get-data/?step=2',
    patchEndpoint: '/api/platform/insolvency-form/?step=2',
    buildInitial,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    updateData(next);
  };

  const onSubmit = (e) => {
    const validForm = handleSubmit(e);
    if (validForm) onNext(validForm);
  };

  return (
    <form onSubmit={onSubmit}>
      {/* ... inputs con value={form.prop} onChange={handleChange} */}
      <button onClick={handleSave} disabled={saveLoading}>Guardar</button>
    </form>
  );
}
```

---

### Gestión de moneda y números

```js
// lib/currency.js
export const parseCurrency = (v) => parseFloat(String(v || '0').replace(/,/g, '')) || 0;
export const formatCurrency = (v) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseCurrency(v));

export const formatCurrencyInput = (setter) => (e) => {
  setter(prev => ({ ...prev, [e.target.name]: formatCurrency(e.target.value) }));
};


// uso
<input
  value={form.amount}
  onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
  onBlur={formatCurrencyInput(setForm)}
/>
```

---

### Errores de red y sesiones globales

```js
// lib/axiosClient.js
import axios from 'axios';

const api = axios.create({ withCredentials: true });
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/platform/auth/login';
    }
    return Promise.reject(err);
  }
);
export default api;
```

---

## 2. BRECHAS DE SEGURIDAD IDENTIFICADAS

| Severidad | Vulnerabilidad | Ubicación | Remediación |
|-----------|----------------|-----------|--------------|
| **MEDIA** | Sin validación de origen en CORS | API Routes | Validar origin en requests |

---

## 3. PUNTOS DE MEJORA RECOMENDADOS

| Área | Mejora | Prioridad | Estimación |
|------|--------|-----------|-------------|
| Testing | Implementar tests unitarios (Jest) | Alta | 40 horas |
| Testing | Agregar tests E2E (Playwright) | Media | 30 horas |
| Performance | Implementar ISR/SSG en páginas estáticas | Media | 15 horas |
| SEO | Agregar sitemap dinámico con todas las rutas | Baja | 5 horas |
| Accesibilidad | Auditoría WCAG 2.1 AA completa | Media | 20 horas |
| DX | Migrar JSX restantes a TSX | Baja | 25 horas |
| Monitoring | Integrar Sentry para errores | Alta | 8 horas |
| Analytics | Configurar Vercel Analytics correctamente | Baja | 3 horas |

---
