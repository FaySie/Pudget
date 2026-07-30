import type { DraftEntry } from './types'
import { postEntry } from './api'

const KEY = 'pudget.queue'

export interface QueuedEntry extends DraftEntry {
  id: string
  queuedAt: number
}

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'x-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export function getQueue(): QueuedEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveQueue(q: QueuedEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(q))
}

export function getQueueCount(): number {
  return getQueue().length
}

/** 把一筆放進佇列（永遠先存本機，確保不掉單） */
export function enqueue(entry: DraftEntry): QueuedEntry {
  const q = getQueue()
  const item: QueuedEntry = { ...entry, id: uuid(), queuedAt: Date.now() }
  q.push(item)
  saveQueue(q)
  return item
}

function removeFromQueue(id: string): void {
  saveQueue(getQueue().filter((e) => e.id !== id))
}

export interface FlushResult {
  sent: number
  remaining: number
  lastError?: string
}

/**
 * 嘗試把佇列送出。成功（含 duplicate）就從佇列移除；
 * 遇到網路錯誤或設定問題就停下、保留剩餘的，等下次再送。
 */
export async function flushQueue(): Promise<FlushResult> {
  const q = getQueue()
  let sent = 0
  let lastError: string | undefined
  for (const item of q) {
    try {
      const r = await postEntry(item)
      if (r.ok) {
        removeFromQueue(item.id)
        sent++
      } else {
        lastError = r.error
        break // 設定/資料問題：停下，保留佇列
      }
    } catch {
      lastError = 'network'
      break // 離線：停下，保留佇列
    }
  }
  return { sent, remaining: getQueueCount(), lastError }
}
