'use client'
import React, { createContext, useCallback, useEffect, useRef } from 'react'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { decodeToken, generateSocketInstance, getAccessTokenFromLS, removeTokensFromLS } from '@/lib/utils'
import type { Socket } from 'socket.io-client'
import { RoleType } from '@/types/jwt.types'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {},
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => {},
  disconnectSocket: () => {}
})

export const useAppContext = () => React.useContext(AppContext)

export default function AppProvider({children} : {children: React.ReactNode}) {
  const [socket, setSocket] = React.useState<Socket | undefined>(undefined)
  const [role, setRoleState] = React.useState<RoleType | undefined>()
  const count = useRef(0)
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLS()
      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRoleState(role)
        setSocket(generateSocketInstance(accessToken))
      }
    }
    count.current++
  }, [])

  const disconnectSocket = useCallback(() => {
    socket?.disconnect()
    setSocket(undefined)
  }, [socket, setSocket])

  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role)
    if(!role) {
      removeTokensFromLS()
    }
  }, [])
  const isAuth = Boolean(role)
  return (
    <AppContext.Provider value={{role, setRole, isAuth, socket, setSocket, disconnectSocket}}>
      <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken />
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}