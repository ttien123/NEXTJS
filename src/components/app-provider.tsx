'use client'
import React, { createContext, useCallback, useEffect } from 'react'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { getAccessTokenFromLS, removeTokensFromLS } from '@/lib/utils'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        }
    }
})

const AppContext = createContext({
  isAuth: false,
  setIsAuth: (isAuth: boolean) => {}
})

export const useAppContext = () => React.useContext(AppContext)

export default function AppProvider({children} : {children: React.ReactNode}) {
  const [isAuth, setIsAuthState] = React.useState(false)
  useEffect(() => {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      setIsAuthState(true)
    }
  }, [])
  const setIsAuth = useCallback((isAuth: boolean) => {
    if (isAuth) {
      setIsAuthState(true)
    }else{
      setIsAuthState(false)
      removeTokensFromLS()
    }
  }, [])
  return (
    <AppContext.Provider value={{isAuth, setIsAuth}}>
      <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken />
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}