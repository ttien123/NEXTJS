'use client'
import { getAccessTokenFromLS, getRefreshTokenFromLS } from '@/lib/utils';
import { useLogoutMutation } from '@/queries/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';


const LogoutPage = () => {
    const { mutateAsync } = useLogoutMutation()
    const router = useRouter()
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
                router.push('/login')
            })
        } else {
            router.push('/')
        }
        
    }, [mutateAsync, router, accessTokenFromUrl, refreshTokenFromUrl])
    
    return (
        <div>
            Logout....
        </div>
    );
}

export default LogoutPage;
