import bcrypt from "bcryptjs"

// Hardcoded admin credentials
const ADMIN_EMAIL = "akash@admin.com"
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("!akash", 10)

// In-memory session store
const validSessions = new Set<string>()

export function validateCredentials(email: string, password: string): boolean {
  if (email !== ADMIN_EMAIL) return false
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
}

export function createSession(): string {
  const token = crypto.randomUUID()
  validSessions.add(token)
  return token
}

export function isValidSession(token: string): boolean {
  return validSessions.has(token)
}

export function deleteSession(token: string): void {
  validSessions.delete(token)
}

export const SESSION_COOKIE_NAME = "admin_session"
