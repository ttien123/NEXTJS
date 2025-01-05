import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import AppProvider from '@/components/app-provider'
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Locale } from '@/i18n/config'
import NextTopLoader from 'nextjs-toploader'
import Footer from '@/components/footer'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})
// export const metadata: Metadata = {
//   title: 'Big Boy Restaurant',
//   description: 'The best restaurant in the world'
// }

export async function generateMetadata(props: {
  params: { locale: Locale }
}) {
  const params = props.params
  const { locale } = params

  const t = await getTranslations({ locale, namespace: 'Brand' })
  return {
    title: t('title'),
    description: t('defaultTitle'),
    // openGraph: {
    //   ...baseOpenGraph
    // }
    // other: {
    //   'google-site-verification': 'KKr5Sgn6rrXntMUp1nDIoQR7mJQujE4BExrlgcFvGTg'
    // }
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode,
  params: {locale: string};
}>) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
        <NextTopLoader showSpinner={false} color='hsl(var(--foreground))'/>
        <NextIntlClientProvider messages={messages}>
          <AppProvider>
            <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
