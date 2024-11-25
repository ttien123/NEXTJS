'use client'
import React, { createContext, useCallback, useEffect } from 'react'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { decodeToken, getAccessTokenFromLS, removeTokensFromLS } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
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
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {}
})

export const useAppContext = () => React.useContext(AppContext)

export default function AppProvider({children} : {children: React.ReactNode}) {
  const [role, setRoleState] = React.useState<RoleType | undefined>()
  useEffect(() => {
    const accessToken = getAccessTokenFromLS()
    if (accessToken) {
      const role = decodeToken(accessToken).role
      setRoleState(role)
    }
  }, [])
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role)
    if(!role) {
      removeTokensFromLS()
    }
  }, [])
  const isAuth = Boolean(role)
  return (
    <AppContext.Provider value={{role, setRole, isAuth}}>
      <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken />
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}