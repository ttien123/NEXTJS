'use client'
import React, { createContext, useCallback, useEffect, useRef } from 'react'
import { create } from 'zustand'
import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { decodeToken, generateSocketInstance, getAccessTokenFromLS, removeTokensFromLS } from '@/lib/utils'
import type { Socket } from 'socket.io-client'
import { RoleType } from '@/types/jwt.types'
import ListenLogoutSocket from './listen-logout-socket'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
})

interface AppStoreType {
    isAuth: boolean
    role: RoleType | undefined
    setRole: (role?: RoleType | undefined) => void
    socket: Socket | undefined
    setSocket: (socket?: Socket | undefined) => void
    disconnectSocket: () => void
}

// const AppContext = createContext({
//   isAuth: false,
//   role: undefined as RoleType | undefined,
//   setRole: (role?: RoleType | undefined) => {},
//   socket: undefined as Socket | undefined,
//   setSocket: (socket?: Socket | undefined) => {},
//   disconnectSocket: () => {}
// })

export const useAppStore = create<AppStoreType>((set) => ({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {
    set({ role, isAuth: !!role })
    if(!role) {
      removeTokensFromLS()
    }
  },
  socket: undefined as Socket | undefined,
  setSocket: (socket?: Socket | undefined) => set({ socket }),
  disconnectSocket: () => set(state => {
    state.socket?.disconnect()
    return { socket: undefined }
  }),
}))

// export const useAppContext = () => React.useContext(AppContext)

export default function AppProvider({children} : {children: React.ReactNode}) {
  const setRole = useAppStore(state => state.setRole);
  const setSocket = useAppStore(state => state.setSocket);

  const count = useRef(0)
  useEffect(() => {
    if (count.current === 0) {
      const accessToken = getAccessTokenFromLS()
      if (accessToken) {
        const role = decodeToken(accessToken).role
        setRole(role)
        setSocket(generateSocketInstance(accessToken))
      }
    }
    count.current++
  }, [setRole, setSocket])

  // const disconnectSocket = useCallback(() => {
  //   socket?.disconnect()
  //   setSocket(undefined)
  // }, [socket, setSocket])

  // const setRole = useCallback((role?: RoleType | undefined) => {
  //   setRoleState(role)
  //   if(!role) {
  //     removeTokensFromLS()
  //   }
  // }, [])
  // const isAuth = Boolean(role)
  return (
    // <AppContext.Provider value={{role, setRole, isAuth, socket, setSocket, disconnectSocket}}>
      <QueryClientProvider client={queryClient}>
          {children}
          <RefreshToken />
          <ListenLogoutSocket />
          <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    // </AppContext.Provider>
  )
}