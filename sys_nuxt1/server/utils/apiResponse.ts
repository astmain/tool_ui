import {
  createError,
  defineEventHandler,
  getRequestHeader,
  getRequestURL,
  H3Error,
  H3Event,
  setResponseStatus,
} from 'h3'

export type ResponseChannel = 'HTTP' | 'WS' | 'SSE'
export type ResponseType = 'REQUEST' | 'RESPONSE' | 'EVENT' | 'ERROR'
export type ErrorType =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'PERMISSION_ERROR'
  | 'BUSINESS_ERROR'
  | 'SYSTEM_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'PARTIAL_FAILURE'

export interface ApiResult<T = unknown> {
  id: string
  channel: ResponseChannel
  type: ResponseType
  event: string
  ok: boolean
  code: string
  message: string
  data: T | null
  error: ErrorInfo | null
  meta: MetaInfo
}

export interface ErrorInfo {
  type: ErrorType
  details?: unknown
}

export interface MetaInfo {
  traceId: string
  requestId?: string
  timestamp: string
  version: string
}

interface LegacyResponse<T = unknown> {
  code?: number | string
  message?: string
  data?: T
}

interface ApiErrorOptions {
  statusCode?: number
  code?: string
  message: string
  type?: ErrorType
  details?: unknown
}

const API_VERSION = 'v1'

export function apiOk<T>(data: T | null = null, message = 'success'): LegacyResponse<T> {
  return { code: 'OK', message, data: data as T }
}

export function apiMessage(message: string): LegacyResponse<null> {
  return { code: 'OK', message, data: null }
}

export function apiFail(options: ApiErrorOptions): never {
  throw createError({
    statusCode: options.statusCode ?? 400,
    message: options.message,
    data: {
      code: options.code,
      type: options.type,
      details: options.details,
    },
  })
}

export function defineApiEventHandler<T>(
  eventName: string,
  handler: (event: H3Event) => Promise<LegacyResponse<T> | T> | LegacyResponse<T> | T,
) {
  return defineEventHandler(async (event) => {
    try {
      const result = await handler(event)
      return toApiResult(event, eventName, result)
    } catch (err) {
      return toApiErrorResult(event, eventName, err)
    }
  })
}

function toApiResult<T>(event: H3Event, eventName: string, result: LegacyResponse<T> | T): ApiResult<T> {
  const legacy = isLegacyResponse(result) ? result : { code: 'OK', message: 'success', data: result as T }
  const rawCode = legacy.code ?? 'OK'
  const ok = rawCode === 'OK' || rawCode === 200

  if (!ok) {
    const statusCode = typeof rawCode === 'number' ? rawCode : 400
    setResponseStatus(event, statusCode)
    return buildResult<T>(event, eventName, {
      type: 'ERROR',
      ok: false,
      code: normalizeErrorCode(rawCode, statusCode),
      message: legacy.message ?? statusMessage(statusCode),
      data: null,
      error: {
        type: errorTypeFromStatus(statusCode),
        details: legacy.data ?? null,
      },
    })
  }

  return buildResult<T>(event, eventName, {
    type: 'RESPONSE',
    ok: true,
    code: 'OK',
    message: legacy.message ?? 'success',
    data: legacy.data ?? null,
    error: null,
  })
}

function toApiErrorResult(event: H3Event, eventName: string, err: unknown): ApiResult<null> {
  const h3Error = err as Partial<H3Error> & { data?: Record<string, unknown> }
  const statusCode = Number(h3Error.statusCode || h3Error.status || 500)
  setResponseStatus(event, statusCode)

  const errorData = typeof h3Error.data === 'object' && h3Error.data ? h3Error.data : {}
  const code = typeof errorData.code === 'string' ? errorData.code : codeFromStatus(statusCode)
  const type = typeof errorData.type === 'string' ? (errorData.type as ErrorType) : errorTypeFromStatus(statusCode)
  const details = Object.prototype.hasOwnProperty.call(errorData, 'details') ? errorData.details : null
  const message = h3Error.message || statusMessage(statusCode)

  return buildResult<null>(event, eventName, {
    type: 'ERROR',
    ok: false,
    code,
    message,
    data: null,
    error: { type, details },
  })
}

function buildResult<T>(
  event: H3Event,
  eventName: string,
  payload: Omit<ApiResult<T>, 'id' | 'channel' | 'event' | 'meta'>,
): ApiResult<T> {
  const id = createMessageId()
  return {
    id,
    channel: 'HTTP',
    event: eventName,
    ...payload,
    meta: {
      traceId: getTraceId(event, id),
      requestId: getRequestId(event),
      timestamp: new Date().toISOString(),
      version: API_VERSION,
    },
  }
}

function isLegacyResponse(value: unknown): value is LegacyResponse {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    ('code' in value || 'message' in value || 'data' in value)
  )
}

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `msg-${crypto.randomUUID()}`
  }
  return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function getTraceId(event: H3Event, fallback: string) {
  return getRequestHeader(event, 'x-trace-id') || fallback.replace(/^msg-/, 'trace-')
}

function getRequestId(event: H3Event) {
  return getRequestHeader(event, 'x-request-id') || getRequestURL(event).pathname
}

function normalizeErrorCode(code: string | number, statusCode: number) {
  if (typeof code === 'string') return code
  return codeFromStatus(statusCode)
}

function codeFromStatus(statusCode: number) {
  if (statusCode === 400) return 'VALIDATION_FAILED'
  if (statusCode === 401) return 'AUTH_ERROR'
  if (statusCode === 403) return 'PERMISSION_DENIED'
  if (statusCode === 404) return 'NOT_FOUND'
  if (statusCode === 405) return 'METHOD_NOT_ALLOWED'
  if (statusCode === 429) return 'RATE_LIMITED'
  return 'SYSTEM_ERROR'
}

function errorTypeFromStatus(statusCode: number): ErrorType {
  if (statusCode === 400) return 'VALIDATION_ERROR'
  if (statusCode === 401) return 'AUTH_ERROR'
  if (statusCode === 403) return 'PERMISSION_ERROR'
  if (statusCode === 429) return 'RATE_LIMIT_ERROR'
  if (statusCode >= 500) return 'SYSTEM_ERROR'
  return 'BUSINESS_ERROR'
}

function statusMessage(statusCode: number) {
  if (statusCode === 400) return '参数校验失败'
  if (statusCode === 401) return '未登录或登录已失效'
  if (statusCode === 403) return '无权限'
  if (statusCode === 404) return '资源不存在'
  if (statusCode === 405) return '不支持的请求方法'
  if (statusCode === 429) return '请求过于频繁'
  return '服务器异常'
}
