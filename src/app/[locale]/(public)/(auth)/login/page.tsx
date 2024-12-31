import { Suspense } from 'react'
import LoginForm from './login-form'
import { setRequestLocale } from 'next-intl/server'

export default async function Login(props: {
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  setRequestLocale(locale)
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
