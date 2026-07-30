import type { Me } from './types'

/** 本機設定（各自手機獨立），不進版控 */
const KEY = {
  me: 'pudget.me',
  frequentItems: 'pudget.frequentItems',
  backendUrl: 'pudget.backendUrl',
  token: 'pudget.token',
  theme: 'pudget.theme',
} as const

export type Theme = 'light' | 'dark' | 'system'

export function getTheme(): Theme {
  const t = localStorage.getItem(KEY.theme)
  return t === 'light' || t === 'dark' ? t : 'system'
}
export function setTheme(t: Theme): void {
  localStorage.setItem(KEY.theme, t)
  applyTheme(t)
}
/** 套用主題:light/dark 加 data-theme;system 移除，交回系統偏好 */
export function applyTheme(t: Theme = getTheme()): void {
  const root = document.documentElement
  if (t === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', t)
}

/** 首次啟用的預設常用項目（可在設定頁增刪） */
const DEFAULT_FREQUENT = ['全聯', '萬家福', '市場青菜', '95汽油', '水返腳']

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
