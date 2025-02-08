import { redirect } from 'next/navigation'

export default async function NotFoundPage() {
    redirect('/es')
}