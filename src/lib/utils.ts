/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "@/hooks/use-toast"
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'

export const getAccessTokenFromLS = () => {
  return isBrowser ? localStorage.getItem('accessToken') : null
}

export const setAccessTokenToLS = (value: string) => {
  return isBrowser ? localStorage.setItem('accessToken', value) : null
}

export const getRefreshTokenFromLS = () => {
  return isBrowser ? localStorage.getItem('refreshToken') : null
}

export const setRefreshTokenToLS = (value: string) => {
  return isBrowser ? localStorage.setItem('refreshToken', value) : null
}

export const removeTokensFromLS = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}

export const checkAndRefreshToken = async (param?: {onError?: () => void, onSuccess?: () => void}) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()
  if (!accessToken || !refreshToken) {
      return
  }
  const decodeAccessToken = jwt.decode(accessToken) as { exp: number, iat: number };
  const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number };
  const now = (new Date().getTime() / 1000) - 1
  if(decodeRefreshToken.exp <= now) {
    removeTokensFromLS()
    return param?.onError && param.onError()
  }
  if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
      try {
          const res = await authApiRequest.refreshToken()
          setAccessTokenToLS(res.payload.data.accessToken)
          setRefreshTokenToLS(res.payload.data.refreshToken)
          param?.onSuccess && param.onSuccess()
      } catch (error) {
        param?.onError && param.onError()
      }
  }
}