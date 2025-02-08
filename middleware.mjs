import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from 'next/server'

const locales = ['es', 'en']
const defaultLocale = 'es'

function getLocale(request) {
    const negotiatorHeaders = new Negotiator({
        headers: { 'accept-language': request.headers.get('accept-language') }
    })

    const languages = negotiatorHeaders.languages()

    const locale = matchLocale(languages, locales, defaultLocale) || defaultLocale
    return locale
}

export function middleware(request) {
    const { pathname } = request.nextUrl

    const hasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (hasLocale) {
        return
    }

    const locale = getLocale(request) || defaultLocale
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(url)
}

export const config = {
    matcher: [
        '/((?!_next).*)',
    ],
}
