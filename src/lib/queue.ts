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

// ===== 已同步本機記錄（供紀錄頁顯示，僅這支手機、有筆數上限）=====
const SYNCED_KEY = 'pudget.synced'
const SYNCED_CAP = 60

export interface SyncedEntry extends QueuedEntry {
  syncedAt: number
  duplicate?: boolean
}

export function getSyncedLog(): SyncedEntry[] {
  try {
    const raw = localStorage.getItem(SYNCED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function addSynced(entry: QueuedEntry, duplicate?: boolean): void {
  const log = getSyncedLog()
  if (log.some((e) => e.id === entry.id)) return // 依 id 去重，避免重複寫入已同步清單
  log.unshift({ ...entry, syncedAt: Date.now(), duplicate })
  if (log.length > SYNCED_CAP) log.length = SYNCED_CAP
  localStorage.setItem(SYNCED_KEY, JSON.stringify(log))
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
let flushing = false

export async function flushQueue(): Promise<FlushResult> {
  // 加鎖:避免多處同時 flush 同一筆(會造成重複進已同步清單)
  if (flushing) return { sent: 0, remaining: getQueueCount() }
  flushing = true
  try {
    return await doFlush()
  } finally {
    flushing = false
  }
}

async function doFlush(): Promise<FlushResult> {
  const q = getQueue()
  let sent = 0
  let lastError: string | undefined
  for (const item of q) {
    try {
      const r = await postEntry(item)
      if (r.ok) {
        removeFromQueue(item.id)
        addSynced(item, r.duplicate)
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
