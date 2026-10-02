import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const backendOrigin = process.env.BACKEND_ORIGIN

  if (!backendOrigin) {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendUrl: URL

  try {
    backendUrl = new URL('/api/feedbacks', backendOrigin)
    backendUrl.search = request.nextUrl.search

    if (!['http:', 'https:'].includes(backendUrl.protocol)) {
      throw new Error('Unsupported backend protocol')
    }

    if (backendUrl.origin === request.nextUrl.origin) {
      throw new Error('Backend origin points to the frontend')
    }
  } catch {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(backendUrl, {
      headers: request.headers.get('cookie')
        ? { cookie: request.headers.get('cookie') as string }
        : undefined,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return Response.json(
      { message: 'Backend is unavailable' },
      { status: 502 },
    )
  }

  if (!backendResponse.headers.get('content-type')?.includes('application/json')) {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  let result: unknown

  try {
    result = await backendResponse.json()
  } catch {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  if (backendResponse.status >= 500) {
    return Response.json(
      { message: 'Backend request failed' },
      { status: backendResponse.status },
    )
  }

  return Response.json(result, { status: backendResponse.status })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (origin) {
    try {
      if (
        new URL(origin).host !==
        (request.headers.get('host') ?? request.nextUrl.host)
      ) {
        throw new Error('Invalid origin')
      }
    } catch {
      return Response.json({ message: 'Invalid request origin' }, { status: 403 })
    }
  }
  const accessToken = request.cookies.get('accessToken')?.value
  const sessionId = request.cookies.get('sessionId')?.value

  if (!accessToken || !sessionId || !/^[a-f\d]{24}$/i.test(sessionId)) {
    return Response.json({ message: 'Not authorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const backendOrigin = process.env.BACKEND_ORIGIN

  if (!backendOrigin) {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendUrl: URL

  try {
    backendUrl = new URL('/api/feedbacks', backendOrigin)

    if (!['http:', 'https:'].includes(backendUrl.protocol)) {
      throw new Error('Unsupported backend protocol')
    }

    if (
      backendUrl.origin === request.nextUrl.origin ||
      backendUrl.host === request.headers.get('host')
    ) {
      throw new Error('Backend origin points to the frontend')
    }
  } catch {
    return Response.json(
      { message: 'Backend is not configured' },
      { status: 503 },
    )
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `accessToken=${encodeURIComponent(accessToken)}; sessionId=${encodeURIComponent(sessionId)}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    return Response.json({ message: 'Backend is unavailable' }, { status: 502 })
  }

  if (
    !backendResponse.headers.get('content-type')?.includes('application/json')
  ) {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  let result: unknown

  try {
    result = await backendResponse.json()
  } catch {
    return Response.json(
      { message: 'Invalid backend response' },
      { status: 502 },
    )
  }

  if (backendResponse.status >= 500) {
    return Response.json(
      { message: 'Backend request failed' },
      { status: backendResponse.status },
    )
  }

  return Response.json(result, { status: backendResponse.status })
}
