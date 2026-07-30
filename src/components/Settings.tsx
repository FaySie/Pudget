import { useState } from 'react'
import { IconX, IconTrash, IconPlus } from '@tabler/icons-react'
import { Button } from './Button'
import {
  getBackendUrl,
  setBackendUrl,
  getToken,
  setToken,
  getMe,
  setMe,
  getFrequentItems,
  setFrequentItems,
} from '../lib/config'
import type { Me } from '../lib/types'

export function Settings({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState(getBackendUrl())
  const [token, setTokenValue] = useState(getToken())
  const [me, setMeValue] = useState<Me>(getMe())
  const [items, setItems] = useState<string[]>(getFrequentItems())
  const [newItem, setNewItem] = useState('')

  function addItem() {
    const v = newItem.trim()
    if (v && !items.includes(v)) {
      setItems([...items, v])
      setNewItem('')
    }
  }
  function removeItem(target: string) {
    setItems(items.filter((it) => it !== target))
  }
  function save() {
    setBackendUrl(url.trim())
    setToken(token.trim())
    setMe(me)
    setFrequentItems(items)
    onClose()
  }

  return (
    <div className="settings-overlay" role="dialog" aria-label="設定">
      <div className="settings-sheet">
        <div className="settings-head">
          <span className="settings-title font-round">設定</span>
          <button className="settings-close icon-muted" onClick={onClose} aria-label="關閉">
            <IconX size={22} stroke={1.8} />
          </button>
        </div>

        <div className="settings-body">
          <div className="field">
            <span className="field__label">我是誰</span>
            <div className="segment segment--two">
              {(['毛毛', '馥仔'] as Me[]).map((x) => (
                <button
                  key={x}
                  type="button"
                  className={`payer font-round ${me === x ? 'payer--selected' : ''}`}
                  onClick={() => setMeValue(x)}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          <label className="field">
            <span className="field__label">後端網址（Apps Script /exec）</span>
            <input
              className="text-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/…/exec"
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span className="field__label">通關碼</span>
            <input
              className="text-input"
              type="password"
              value={token}
              onChange={(e) => setTokenValue(e.target.value)}
              placeholder="與後端 TOKEN 一致"
              autoComplete="off"
            />
          </label>

          <div className="field">
            <span className="field__label">常用項目（記帳時可下拉選）</span>
            <div className="freq-add">
              <input
                className="text-input"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addItem()
                  }
                }}
                placeholder="新增常用項目…"
              />
              <button type="button" className="freq-add__btn" onClick={addItem} aria-label="新增">
                <IconPlus size={20} stroke={2} />
              </button>
            </div>
            <ul className="freq-list">
              {items.map((it) => (
                <li key={it} className="freq-item">
                  <span>{it}</span>
                  <button
                    type="button"
                    className="freq-del icon-muted"
                    onClick={() => removeItem(it)}
                    aria-label={`刪除 ${it}`}
                  >
                    <IconTrash size={18} stroke={1.8} />
                  </button>
                </li>
              ))}
              {items.length === 0 && <li className="freq-empty">還沒有常用項目</li>}
            </ul>
          </div>
        </div>

        <div className="settings-foot">
          <Button onClick={save}>儲存</Button>
        </div>
      </div>
    </div>
  )
}
