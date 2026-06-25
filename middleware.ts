import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/scan', '/ingredients', '/recipes', '/pantry', '/planning', '/courses', '/history', '/account']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isProtected = PROTECTED.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (!isProtected) return NextResponse.next()

  // Demo mode — bypass auth
  if (request.cookies.get('frigochef_demo')?.value === 'true') {
    return NextResponse.next()
  }

  // Check for Supabase session cookie (set by @supabase/ssr)
  const hasSession = request.cookies.getAll().some(
    c => c.name.includes('-auth-token') && c.value
  )

  if (!hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
