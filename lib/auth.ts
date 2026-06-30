import { SignJWT, jwtVerify } from 'jose'

function secret() {
  const s = process.env.ADMIN_JWT_SECRET
  if (!s) throw new Error('ADMIN_JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

export async function createSessionToken() {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret())
    return true
  } catch {
    return false
  }
}

export async function verifyAdminRequest(req: Request): Promise<boolean> {
  const cookie = req.headers.get('cookie') ?? ''
  const match = cookie.match(/admin-session=([^;]+)/)
  if (!match) return false
  return verifySessionToken(match[1])
}
