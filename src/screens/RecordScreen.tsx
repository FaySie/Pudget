import { useState, useRef, type ReactNode } from 'react'
import {
  IconSettings,
  IconMoodSmile,
  IconCircleCheck,
  IconWifiOff,
  IconClock,
  IconKey,
  IconAlertCircle,
} from '@tabler/icons-react'
import { Mascot } from '../components/Mascot'
import { AmountCard } from '../components/AmountCard'
import { DateField } from '../components/DateField'
import { PayerSegment } from '../components/PayerSegment'
import { CategoryGrid } from '../components/CategoryGrid'
import { ItemField } from '../components/ItemField'
import { Accordion } from '../components/Accordion'
import { Toggle } from '../components/Toggle'
import { Button } from '../components/Button'
import { Settings } from '../components/Settings'
import { getFrequentItems, getBackendUrl, todayLocal } from '../lib/config'
import { enqueue, flushQueue, getQueueCount } from '../lib/queue'
import type { Payer } from '../lib/types'

interface Toast {
  text: string
  icon?: ReactNode
}

export function RecordScreen() {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [payer, setPayer] = useState<Payer>('毛毛')
  const [category, setCategory] = useState<string | null>(null)
  const [item, setItem] = useState('')
  const [note, setNote] = useState('')
  const [settleFirst, setSettleFirst] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [pending, setPending] = useState(getQueueCount())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const toastTimer = useRef<number | undefined>(undefined)

  const frequent = getFrequentItems()
  const monthLabel = `${Number(date.slice(5, 7))}月`

  function flash(text: string, icon?: ReactNode) {
    setToast({ text, icon })
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2200)
  }

  async function submit() {
    if (!amount || !category || !item.trim()) {
      flash('請先填金額、類別、項目', <IconAlertCircle size={15} stroke={2} />)
      return
    }
    const wasSettle = settleFirst
    enqueue({ date, category, item: item.trim(), amount, payer, note, settleFirst })
    setAmount('')
    setItem('')
    setNote('')
    setSettleFirst(false)
    setPending(getQueueCount())

    if (!getBackendUrl()) {
      flash('請先到設定填後端網址與通關碼', <IconSettings size={15} stroke={2} />)
      return
    }
    flash('同步中…')
    const { sent, lastError } = await flushQueue()
    setPending(getQueueCount())
    if (sent > 0) {
      flash(
        wasSettle ? `已寫進 ${monthLabel}流水帳（紅字待結清）` : `已寫進 ${monthLabel}流水帳`,
        <IconCircleCheck size={15} stroke={2} />,
      )
    } else if (lastError === 'invalid_token') {
      flash('通關碼不對，請到設定確認', <IconKey size={15} stroke={2} />)
    } else {
      flash('已存手機，連上網路會自動送出', <IconWifiOff size={15} stroke={2} />)
    }
  }

  return (
    <>
      <header className="header">
        <Mascot />
        <div className="header__title">
          <span className="header__name font-round">記帳布</span>
          <span className="header__sub">隨手記一筆</span>
        </div>
        <button
          type="button"
          className="header__gear icon-muted"
          aria-label="設定"
          onClick={() => setSettingsOpen(true)}
        >
          <IconSettings size={22} stroke={1.8} />
        </button>
      </header>

      <div className="scroll">
        <AmountCard value={amount} onChange={setAmount} />

        <div className="content">
          <DateField value={date} onChange={setDate} />

          <PayerSegment value={payer} onChange={setPayer} />
          {payer === '共用錢包' && (
            <div className="wallet-note">
              <span className="icon-filled">
                <IconMoodSmile size={16} stroke={1.7} />
              </span>
              也會自動記一筆「支出」到蛙太錢包
            </div>
          )}

          <CategoryGrid value={category} onChange={setCategory} />

          <ItemField value={item} onChange={setItem} suggestions={frequent} />

          <Accordion title="備註／需先結清" dot={settleFirst}>
            <input
              className="text-input"
              type="text"
              placeholder="備註（可留空）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className={`settle ${settleFirst ? 'settle--on' : ''}`}>
              <div>
                <div className="settle__t1">需先結清・代墊</div>
                <div className="settle__t2">會在表格標成紅色，結清後你們自行刪除</div>
              </div>
              <Toggle checked={settleFirst} onChange={setSettleFirst} label="需先結清" />
            </div>
          </Accordion>

          <p className="hint">寫進「{monthLabel}」流水帳・備註會註明由小布登記</p>
        </div>
      </div>

      <div className="bottom">
        {pending > 0 && (
          <div className="pending">
            <IconClock size={14} stroke={2} />
            {pending} 筆待同步
          </div>
        )}
        <div className="submit-wrap">
          <Button onClick={submit}>記一筆</Button>
        </div>
      </div>

      {toast && (
        <div className="toast">
          {toast.icon && <span className="toast__icon">{toast.icon}</span>}
          <span>{toast.text}</span>
        </div>
      )}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
