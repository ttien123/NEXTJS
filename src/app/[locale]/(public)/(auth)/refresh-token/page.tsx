'use client'
import { checkAndRefreshToken, getRefreshTokenFromLS } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';


const RefreshToken = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const redirectPathname = searchParams.get('redirect')
    useEffect(() => {
        if ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLS())) {
            checkAndRefreshToken({ onSuccess: () => {
                router.push(redirectPathname || '/')
            }})
        }else{
            router.push('/')
        }
       
    }, [ router, refreshTokenFromUrl, redirectPathname])
    
    return (
        <div>
            RefreshToken....
        </div>
    );
}
const RefreshTokenPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RefreshToken />
        </Suspense>
    );
}

export default RefreshTokenPage;
