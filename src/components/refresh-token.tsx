'use client';
import { checkAndRefreshToken } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from './app-provider';

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];
const RefreshToken = () => {
    const pathname = usePathname();
    const router = useRouter();
    const socket = useAppStore(state => state.socket)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) {
            return
        }
        let interval: any = null;
        
        const onRefreshToken = (force?: boolean) => checkAndRefreshToken({ 
            onError: () => {
                clearInterval(interval)
                disconnectSocket()
                router.push('/login')
            },
            force
            })
        onRefreshToken()
        const TIMEOUT = 1000
        interval = setInterval(onRefreshToken, TIMEOUT)

        if (socket?.connected) {
            onConnect();
          }
      
        function onConnect() {}
        function onDisconnect() {}
        function onRefreshTokenSocket() {
            onRefreshToken(true)
        }

        socket?.on("connect", onConnect);
        socket?.on("disconnect", onDisconnect);
        socket?.on("refresh-token", onRefreshTokenSocket);

        return () => {
            socket?.off("connect", onConnect);
            socket?.on("refresh-token", onRefreshTokenSocket);
            socket?.off("disconnect", onDisconnect);
            clearInterval(interval)
        }
    }, [pathname, router, socket, disconnectSocket])
  return (
    null
  );
}

export default RefreshToken;
