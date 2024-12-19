'use client'
import { useAppStore } from '@/components/app-provider';
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useRef } from 'react';

const Logout = () => {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
    const setRole = useAppStore(state => state.setRole)
    const disconnectSocket = useAppStore(state => state.disconnectSocket)
    const searchParams = useSearchParams()
    const refreshTokenFromUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    const ref = useRef<any>(null)
    useEffect(() => {
        if (!ref.current &&
            ((refreshTokenFromUrl && refreshTokenFromUrl === getRefreshTokenFromLS()) || 
            (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLS()))
        ) {
            ref.current = mutateAsync
            mutateAsync().then(() => {
                setTimeout(() => {
                    ref.current = null
                })
                setRole()
                disconnectSocket()
                router.push('/login')
            })
        } else {
            router.push('/')
        }
        
    }, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl, setRole, disconnectSocket])
    
    return (
        <div>
            Logout....
        </div>
    );
}

const LogoutPage = () => {
    return (
        <Suspense><Logout /></Suspense>
    )
}

export default LogoutPage;
