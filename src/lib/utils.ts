import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import { EntityError } from "./http"
import { toast } from "@/hooks/use-toast"
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth"
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type"
import envConfig from "@/config"
import { TokenPayload } from "@/types/jwt.types"
import guestApiRequest from "@/apiRequests/guest"
import { format } from "date-fns"
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import { io } from "socket.io-client"
import slugify from "slugify"
import { convert } from "html-to-text"
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

export const checkAndRefreshToken = async (param?: {onError?: () => void, onSuccess?: () => void, force?: boolean}) => {
  const accessToken = getAccessTokenFromLS()
  const refreshToken = getRefreshTokenFromLS()
  if (!accessToken || !refreshToken) {
      return
  }
  const decodeAccessToken = decodeToken(accessToken)
  const decodeRefreshToken = decodeToken(refreshToken)
  const now = (new Date().getTime() / 1000) - 1
  if(decodeRefreshToken.exp <= now) {
    removeTokensFromLS()
    return param?.onError && param.onError()
  }
  if (param?.force || (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3)) {
      try {
          const role = decodeRefreshToken.role
          const res = role === Role.Guest ? await guestApiRequest.refreshToken() : await authApiRequest.refreshToken()
          setAccessTokenToLS(res.payload.data.accessToken)
          setRefreshTokenToLS(res.payload.data.refreshToken)
          param?.onSuccess?.()
      } catch (error) {
        console.log(error);
        param?.onError?.()
      }
  }
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

export const generateSocketInstance = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result = null
  try {
    result = await fn()
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error
    }
  }
  return result
}

export const generateSlugUrl = ({name, id}: {name: string, id: number}) => {
  return `${slugify(name)}-i.${id}`
}

export const getIdFromSlugUrl = (slugUrl: string) => {
  return Number(slugUrl.split('-i.')[1])
}

export const htmlToTextForDescription = (html: string) => {
  return convert(html, {
    limits: {
      maxInputLength: 140
    }
  })
}