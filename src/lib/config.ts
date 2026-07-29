import type { Me } from './types'

/** 本機設定（各自手機獨立），不進版控 */
const KEY = {
  me: 'pudget.me',
  frequentItems: 'pudget.frequentItems',
  backendUrl: 'pudget.backendUrl',
  token: 'pudget.token',
} as const

/** 首次啟用的預設常用項目（可在設定頁增刪） */
const DEFAULT_FREQUENT = ['全聯', '麥當勞早餐', 'Costco', '全家', '7-11']

export function getMe(): Me {
  return (localStorage.getItem(KEY.me) as Me) || '毛毛'
}
export function setMe(me: Me): void {
  localStorage.setItem(KEY.me, me)
}

export function getFrequentItems(): string[] {
  const raw = localStorage.getItem(KEY.frequentItems)
  if (raw == null) return DEFAULT_FREQUENT
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_FREQUENT
  } catch {
    return DEFAULT_FREQUENT
  }
}
export function setFrequentItems(items: string[]): void {
  localStorage.setItem(KEY.frequentItems, JSON.stringify(items))
}

export function getBackendUrl(): string {
  return localStorage.getItem(KEY.backendUrl) ?? ''
}
export function setBackendUrl(url: string): void {
  localStorage.setItem(KEY.backendUrl, url)
}

export function getToken(): string {
  return localStorage.getItem(KEY.token) ?? ''
}
export function setToken(token: string): void {
  localStorage.setItem(KEY.token, token)
}

/** 本地日期 yyyy-mm-dd（避免 toISOString 的 UTC 位移） */
export function todayLocal(): string {
  const d = new Date()
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}
