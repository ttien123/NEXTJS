'use client';
import { checkAndRefreshToken, getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import jwt from "jsonwebtoken";
import authApiRequest from '@/apiRequests/auth';

const UNAUTHENTICATED_PATH = ['/login', '/logout', '/refresh-token'];
const RefreshToken = () => {
    const pathname = usePathname();
    useEffect(() => {
        if (UNAUTHENTICATED_PATH.includes(pathname)) {
            return
        }
        let interval: any = null;
        
        checkAndRefreshToken({ onError: () => {
            clearInterval(interval)
        } })

        const TIMEOUT = 1000
        interval = setInterval(checkAndRefreshToken, TIMEOUT)

        return () => {
            clearInterval(interval)
        }
    }, [pathname])
  return (
    null
  );
}

export default RefreshToken;
