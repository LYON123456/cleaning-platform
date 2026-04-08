import { NextRequest, NextResponse } from 'next/server'

// 逗號分隔的 IP 清單，留空則不限制（開發環境用）
const ADMIN_IP_WHITELIST = (process.env.ADMIN_IP_WHITELIST ?? '')
  .split(',')
  .map((ip) => ip.trim())
  .filter(Boolean)

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    // 未設定白名單時不限制（本機開發）
    if (ADMIN_IP_WHITELIST.length === 0) {
      return NextResponse.next()
    }

    const clientIp = getClientIp(request)

    if (!ADMIN_IP_WHITELIST.includes(clientIp)) {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden', message: '此 IP 不在允許清單內' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
