import 'server-only';
import type { Translations } from './dictionary.type';

const dictionaries: Record<string, () => Promise<Translations>> = {
    en: () => import('./en.json').then((module) => module.default as Translations),
    es: () => import('./es.json').then((module) => module.default as Translations),
}

export async function getDictionary(locale: 'es' | 'en'): Promise<Translations> {
    return dictionaries[locale] ? dictionaries[locale]() : dictionaries['es']();
}