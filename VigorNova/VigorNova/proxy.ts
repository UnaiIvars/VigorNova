import { type NextRequest } from 'next/server'
import { createClient } from './utils/supabase/proxy'

import { NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  try {
    return await createClient(request)
  } catch (e: any) {
    return NextResponse.json({ error: "PROXY CRASH: " + (e?.message || String(e)) }, { status: 500 });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
