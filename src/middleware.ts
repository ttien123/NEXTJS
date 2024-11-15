import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
const privatePaths = ['/manage']
const unAuthPaths = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const accessToken = request.cookies.get('accessToken')?.value
    const refreshToken = request.cookies.get('refreshToken')?.value

    //Chưa đăng nhập thì không cho vào private paths
    if (privatePaths.some(path => pathname.startsWith(path) && !refreshToken)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    //Đang nhập rồi thì không cho vào login nữa
    if (unAuthPaths.some(path => pathname.startsWith(path) && refreshToken)) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    //Trường hợp đăng nhập rồi, nhưng access token hết hạn

    if (privatePaths.some(path => pathname.startsWith(path) && !accessToken && refreshToken)) {
        const url = new URL('/refresh-token', request.url)
        url.searchParams.set('refreshToken', request.cookies.get('refreshToken')?.value ?? '')
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}
 
export const config = {
  matcher: ['/manage/:path*', '/login'],
}