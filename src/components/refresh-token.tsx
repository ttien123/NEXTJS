'use client';
import socket from '@/lib/socket';
import { checkAndRefreshToken } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];
const RefreshToken = () => {
    const pathname = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) {
            return
        }
        let interval: any = null;
        
        const onRefreshToken = (force?: boolean) => checkAndRefreshToken({ 
            onError: () => {
                clearInterval(interval)
                router.push('/login')
            },
            force
            })
        onRefreshToken()
        const TIMEOUT = 1000
        interval = setInterval(onRefreshToken, TIMEOUT)

        if (socket.connected) {
            onConnect();
          }
      
        function onConnect() {}
        function onDisconnect() {}
        function onRefreshTokenSocket() {
            onRefreshToken(true)
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("refresh-token", onRefreshTokenSocket);

        return () => {
            socket.off("connect", onConnect);
            socket.on("refresh-token", onRefreshTokenSocket);
            socket.off("disconnect", onDisconnect);
            clearInterval(interval)
        }
    }, [pathname, router])
  return (
    null
  );
}

export default RefreshToken;
