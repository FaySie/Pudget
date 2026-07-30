import { useState, useEffect } from 'react'
import { IconX, IconClock, IconCircleCheck } from '@tabler/icons-react'
import { Mascot } from './Mascot'
import {
  getQueue,
  getSyncedLog,
  flushQueue,
  type QueuedEntry,
  type SyncedEntry,
} from '../lib/queue'
import { CATEGORIES } from '../data/categories'

function fmtDate(d: string): string {
  const p = d.split('-')
  return `${Number(p[1])}/${Number(p[2])}`
}

function Row({ e }: { e: QueuedEntry | SyncedEntry }) {
  const cat = CATEGORIES.find((c) => c.label === e.category)
  const Icon = cat?.Icon
  return (
    <li className="rec-row">
      {Icon && (
        <span className="rec-row__icon icon-filled">
          <Icon size={20} stroke={1.7} />
        </span>
      )}
      <div className="rec-row__main">
        <div className="rec-row__item">
          {e.item}
          {e.settleFirst && <span className="rec-row__flag">代墊</span>}
        </div>
        <div className="rec-row__meta">
          {fmtDate(e.date)}・{e.payer}・{e.category}
        </div>
      </div>
      <div className="rec-row__amt">NT${e.amount}</div>
    </li>
  )
}

export function Records({ onClose, onFlush }: { onClose: () => void; onFlush: () => void }) {
  const [pending, setPending] = useState<QueuedEntry[]>(getQueue())
  const [synced, setSynced] = useState<SyncedEntry[]>(getSyncedLog())
  const [syncing, setSyncing] = useState(false)

  async function syncNow() {
    setSyncing(true)
    await flushQueue()
    setSyncing(false)
    setPending(getQueue())
    setSynced(getSyncedLog())
    onFlush()
  }

  // 開啟即嘗試同步一次
  useEffect(() => {
    syncNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isEmpty = pending.length === 0 && synced.length === 0

  return (
    <div className="settings-overlay" role="dialog" aria-label="紀錄">
      <div className="settings-sheet">
        <div className="settings-head">
          <span className="settings-title font-round">紀錄</span>
          <button className="settings-close icon-muted" onClick={onClose} aria-label="關閉">
            <IconX size={22} stroke={1.8} />
          </button>
        </div>

        <div className="settings-body">
          {isEmpty ? (
            <div className="rec-empty-state">
              <Mascot size={76} />
              <p className="rec-empty-state__title">還沒有任何紀錄</p>
              <p className="rec-empty-state__sub">
                記一筆之後，這支手機記的帳就會出現在這裡。
                <br />
                完整帳目請看 Google Sheet。
              </p>
            </div>
          ) : (
            <>
              <section className="rec-section">
                <div className="rec-head">
                  <span className="icon-muted">
                    <IconClock size={17} stroke={2} />
                  </span>
                  待同步
                  <span className="rec-count">{pending.length}</span>
                </div>
                {pending.length ? (
                  <ul className="rec-list">
                    {pending.map((e) => (
                      <Row key={e.id} e={e} />
                    ))}
                  </ul>
                ) : (
                  <p className="rec-empty">沒有待同步的帳 🎉</p>
                )}
                {pending.length > 0 && (
                  <button className="rec-sync" onClick={syncNow} disabled={syncing}>
                    {syncing ? '同步中…' : '立即同步'}
                  </button>
                )}
              </section>

              <section className="rec-section">
                <div className="rec-head">
                  <span className="icon-muted">
                    <IconCircleCheck size={17} stroke={2} />
                  </span>
                  已同步
                  <span className="rec-count">{synced.length}</span>
                </div>
                {synced.length ? (
                  <ul className="rec-list">
                    {synced.map((e) => (
                      <Row key={e.id + '-' + e.syncedAt} e={e} />
                    ))}
                  </ul>
                ) : (
                  <p className="rec-empty">還沒有已同步的帳</p>
                )}
              </section>

              <p className="rec-note">
                只顯示「這支手機」記的帳（本機保留最近 60 筆）。要看完整帳目、修改或刪除，請到 Google Sheet。
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
