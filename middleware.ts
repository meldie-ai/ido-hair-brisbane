import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

function secret() {
  return new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? '')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('admin-session')?.value
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    if (token) {
      try {
        await jwtVerify(token, secret())
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      } catch { /* bad token, stay on login */ }
    }
    return NextResponse.next()
  }

  // All other /admin/* routes require a valid session
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))
  try {
    await jwtVerify(token, secret())
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = { matcher: ['/admin/:path*'] }
