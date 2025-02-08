import QueryProvider from '@/providers/QueryProvider';
import ToastProvider from '@/providers/ToastProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/assets/css/globals.css';

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export default async function RootLayout({ children, params }) {

  const { lang } = await params

  return (
    <html lang={lang}>
      <body>
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
