import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/utils'
import { Role } from './constants/type'

const managePath = ['/manage']
const guestPath = ['/guest']
const onlyOwnerPaths = ['/manage/accounts']
const privatePaths = [...managePath, ...guestPath]
const unAuthPaths = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    //1. Chưa đăng nhập thì không cho vào private paths
    if (privatePaths.some(path => pathname.startsWith(path) && !refreshToken)) {
        const url = new URL('/login', request.url)
        url.searchParams.set('clearTokens', 'true')
        return NextResponse.redirect(url)
    }

    //2.Đang nhập rồi thì không cho vào login nữa

    if (refreshToken) {
        // 2.1 Nếu cố tình vào lại trang login sẽ redirect về trang chủ
        if (unAuthPaths.some(path => pathname.startsWith(path) && refreshToken)) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        //2.2 Trường hợp đăng nhập rồi, nhưng access token hết hạn
        if (privatePaths.some(path => pathname.startsWith(path) && !accessToken)) {
            const url = new URL('/refresh-token', request.url)
            url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? '')
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url)
        }

        //2.3 vào không đúng role, redirect về trang chủ
        const role = decodeToken(refreshToken).role
        //Guest nhưng cố vào route owner
        const isGuestGoToManagePath = role === Role.Guest && managePath.some(path => pathname.startsWith(path))
        //không phải guest nhưng cố vào route guest
        const isNotGuestGoToGuestPath = role !== Role.Guest && guestPath.some(path => pathname.startsWith(path))
        //không phải owner nhưng cố vào route owner
        const isNotOwnerGoToOwnerPath = role !== Role.Owner && onlyOwnerPaths.some(path => pathname.startsWith(path))
        if (isGuestGoToManagePath || isNotGuestGoToGuestPath || isNotOwnerGoToOwnerPath) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }
    
    return NextResponse.next()
}
 
export const config = {
  matcher: ['/manage/:path*','/guest/:path*','/login'],
}