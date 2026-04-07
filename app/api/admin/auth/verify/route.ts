import { NextRequest, NextResponse } from "next/server"
import { isValidSession, SESSION_COOKIE_NAME } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!token || !isValidSession(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
