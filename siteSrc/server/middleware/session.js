import { deleteCookie, eventHandler, parseCookies, setCookie } from 'h3'
import { webcrypto as crypto } from 'node:crypto'
import Redis from "ioredis";
import { useRuntimeConfig } from '#imports'

// storage
const {session: sessionSettings} = useRuntimeConfig()

const redis = new Redis(sessionSettings.redisURL);
const prefixStorage = (sessionId) => `sessions:${sessionId}`
const setStorageSession = async(sessionId, session) => redis.set(prefixStorage(sessionId), JSON.stringify(session), "EX", sessionSettings.ttl)



const SESSION_COOKIE_NAME = 'sessionId'
const safeSetCookie = (event, name, value, createdAt) => {
  const sessionOptions = sessionSettings.session

  setCookie(event, name, value, {
    // Set cookie expiration date to now + expiryInSeconds
    expires: new Date(createdAt.getTime() + 604800 * 1000),
    // Wether to send cookie via HTTPs to mitigate man-in-the-middle attacks
    secure: sessionOptions.cookieSecure,
    // Wether to send cookie via HTTP requests and not allowing access of cookie from JS to mitigate XSS attacks
    httpOnly: sessionOptions.cookieHttpOnly,
    // Do not send cookies on many cross-site requests to mitigates CSRF and cross-site attacks, see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite#lax
    sameSite: sessionOptions.cookieSameSite,
    // Set cookie for subdomain
    domain: sessionOptions.domain || undefined
  })
}

const checkSessionExpirationTime = (session, sessionExpiryInSeconds) => {
  const now = new Date().getTime()
  if ((new Date(session.createdAt).getTime() - now) * 1000 > sessionExpiryInSeconds) {
    throw new Error("Session expired")
  }
}

/**
 * Get the current session id.
 *
 * The session id may be set only on the cookie or only on the context or both. This is because when the
 * session was just created, the session cookie is not yet set on the request (only on the response!). To
 * still function in this scenario the session-middleware sets the cookie on the response and the `sessionId` on the `event.context`.
 *
 * This method extracts the session id and ensures that if the id on cookie and context match if both exist.
 * @param event H3Event Event passing through middleware
 */
const getCurrentSessionId = (event) => {
  const sessionIdRequest = parseCookies(event).sessionId
  const sessionIdContext = event.context.sessionId

  if (sessionIdContext && sessionIdRequest && sessionIdContext !== sessionIdRequest) {
    return null
  }

  return sessionIdRequest || sessionIdContext || null
}

export const deleteSession = async (event) => {
  const currentSessionId = getCurrentSessionId(event)
  if (currentSessionId) {
    await redis.del(prefixStorage(currentSessionId))
  }

  deleteCookie(event, SESSION_COOKIE_NAME)
}

const newSession = async (event) => {
  const sessionOptions = sessionSettings.session
  const now = new Date()

  // (Re-)Set cookie
  const sessionId = nanoid(sessionOptions.idLength)
  safeSetCookie(event, SESSION_COOKIE_NAME, sessionId, now)

  // Store session data in storage
  const session = {
    id: sessionId,
    createdAt: now,
  }
  await setStorageSession(sessionId, session)

  return session
}

const getSession = async (event) => {
  // 1. Does the sessionId cookie exist on the request?
  const existingSessionId = getCurrentSessionId(event)
  if (!existingSessionId) {
    return null
  }

  // 2. Does the session exist in our storage?
  const session = JSON.parse(await redis.get(prefixStorage(existingSessionId)))
  if (!isSession(session)) {
    return null
  }

  const sessionOptions = sessionSettings.session
  const sessionExpiryInSeconds = sessionOptions.expiryInSeconds

  try {
    // 3. Is the session not expired?
    if (sessionExpiryInSeconds !== false) {
      checkSessionExpirationTime(session, sessionExpiryInSeconds)
    }
  } catch {
    await deleteSession(event) // Cleanup old session data to avoid leaks

    return null
  }

  return session
}

const updateSessionExpirationDate = (session, event) => {
  const now = new Date()
  safeSetCookie(event, SESSION_COOKIE_NAME, session.id, now)
  return { ...session, createdAt: now }
}

function isSession (shape) {
  return typeof shape === 'object' && !!shape && 'id' in shape && 'createdAt' in shape
}

const ensureSession = async (event) => {
  const sessionOptions = sessionSettings.session

  let session = await getSession(event)
  if (!session) {
    // console.log(`new session for path: ${event.path} with method ${event.node.req.method}`)
    // only create session on callback route
    session = await newSession(event)
  } else if (sessionOptions.rolling) {
    session = updateSessionExpirationDate(session, event)
  }

  event.context.sessionId = session.id
  event.context.session = session
  return session
}

export default eventHandler(async (event) => {
  // if route is blacklisted
  // const isBlackListedRoute = sessionSettings.ignoredRoutes.find((el)=>event.path.match(el.path) && el.method === event.node.req.method.toLowerCase())
  // if (isBlackListedRoute) return;
  
  // 1. Ensure that a session is present by either loading or creating one
  await ensureSession(event)

  // 2. Setup a hook that saves any changed made to the session by the subsequent endpoints & middlewares
  event.node.res.on('finish', async () => {
    // Session id may not exist if session was deleted
    const session = await getSession(event)
    if (!session) {
      return
    }

    await setStorageSession(session.id, event.context.session)
  })
  
  event.context.deleteSession = deleteSession
})


// nanoid
const POOL_SIZE_MULTIPLIER = 128
let pool, poolOffset
export const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'

function fillPool(bytes) {
  if (!pool || pool.length < bytes) {
    pool = Buffer.allocUnsafe(bytes * POOL_SIZE_MULTIPLIER)
    crypto.getRandomValues(pool)
    poolOffset = 0
  } else if (poolOffset + bytes > pool.length) {
    crypto.getRandomValues(pool)
    poolOffset = 0
  }
  poolOffset += bytes
}

export function nanoid(size = 21) {
  fillPool((size -= 0))
  let id = ''
  for (let i = poolOffset - size; i < poolOffset; i++) {
    id += urlAlphabet[pool[i] & 63]
  }
  return id
}