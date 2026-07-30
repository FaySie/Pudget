import { getBackendUrl, getToken } from './config'
import type { DraftEntry } from './types'

export interface PostResult {
  ok: boolean
  duplicate?: boolean
  error?: string
  message?: string
  month?: string
  row?: number
}

/**
 * 送一筆到 Apps Script 後端。
 * 用 text/plain 避免 CORS preflight（Apps Script 會 302 轉址並帶 CORS 標頭）。
 */
export async function postEntry(entry: DraftEntry & { id: string }): Promise<PostResult> {
  const url = getBackendUrl()
  if (!url) return { ok: false, error: 'no_backend' }

  const payload = {
    token: getToken(),
    id: entry.id,
    date: entry.date,
    category: entry.category,
    item: entry.item,
    amount: Number(entry.amount),
    payer: entry.payer,
    note: entry.note,
    settleFirst: entry.settleFirst,
    source: 'app',
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })
  if (!res.ok) return { ok: false, error: 'http_' + res.status }
  try {
    return (await res.json()) as PostResult
  } catch {
    return { ok: false, error: 'bad_response' }
  }
}
