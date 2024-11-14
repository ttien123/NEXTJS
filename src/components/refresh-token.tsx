'use client';
import { getAccessTokenFromLS, getRefreshTokenFromLS, setAccessTokenToLS, setRefreshTokenToLS } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
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
        const checkAndRefreshToken = async () => {
            const accessToken = getAccessTokenFromLS()
            const refreshToken = getRefreshTokenFromLS()
            if (!accessToken || !refreshToken) {
                return
            }
            const decodeAccessToken = jwt.decode(accessToken) as { exp: number, iat: number };
            const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number };
            const now = Math.round(new Date().getTime() / 1000)
            if(decodeRefreshToken.exp <= now) {
                return
            }
            if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken()
                    setAccessTokenToLS(res.payload.data.accessToken)
                    setRefreshTokenToLS(res.payload.data.refreshToken)
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }
        checkAndRefreshToken()

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
