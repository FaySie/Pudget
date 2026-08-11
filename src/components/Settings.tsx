import { useState } from 'react'
import {
  IconX,
  IconTrash,
  IconPlus,
  IconBrightness2,
  IconMoon,
  IconDeviceDesktop,
  type Icon as TablerIcon,
} from '@tabler/icons-react'
import { Button } from './Button'
import { Accordion } from './Accordion'
import {
  getBackendUrl,
  setBackendUrl,
  getToken,
  setToken,
  getFrequentItems,
  setFrequentItems,
  getTheme,
  setTheme,
  type Theme,
} from '../lib/config'
import { usePwaUpdate } from './PwaUpdateProvider'

const THEME_OPTIONS: { value: Theme; label: string; Icon: TablerIcon }[] = [
  { value: 'light', label: '淺色', Icon: IconBrightness2 },
  { value: 'dark', label: '深色', Icon: IconMoon },
  { value: 'system', label: '跟隨系統', Icon: IconDeviceDesktop },
]

const APP_VERSION = __APP_VERSION__

export function Settings({ onClose }: { onClose: () => void }) {
  const [url, setUrl] = useState(getBackendUrl())
  const [token, setTokenValue] = useState(getToken())
  const [items, setItems] = useState<string[]>(getFrequentItems())
  const [newItem, setNewItem] = useState('')
  const [theme, setThemeState] = useState<Theme>(getTheme())
  const { checkForUpdate, applyUpdate, checking } = usePwaUpdate()
  const [checkMsg, setCheckMsg] = useState('')

  function chooseTheme(t: Theme) {
    setThemeState(t)
    setTheme(t) // 立即套用並儲存
  }

  async function handleCheckUpdate() {
    setCheckMsg('')
    const result = await checkForUpdate()
    if (result === 'updated') applyUpdate() // 有新版 → 重新載入套用
    else setCheckMsg(result === 'latest' ? '已是最新版' : '目前無法檢查（請先加到主畫面）')
  }

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
    setFrequentItems(items)
    onClose()
  }

  return (
    <div className="settings-overlay" role="dialog" aria-label="設定">
      <div className="settings-sheet">
        <div className="settings-head">
          <span className="settings-title font-round">設定</span>
          <button className="settings-close icon-muted" onClick={onClose} aria-label="關閉">
            <IconX size={22} stroke={1.5} />
          </button>
        </div>

        <div className="settings-body">
          <div className="field">
            <span className="field__label">外觀</span>
            <div className="segment">
              {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  className={`theme-opt ${theme === value ? 'is-active' : ''}`}
                  aria-pressed={theme === value}
                  onClick={() => chooseTheme(value)}
                >
                  <Icon size={19} stroke={1.5} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

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
                    <IconTrash size={18} stroke={1.5} />
                  </button>
                </li>
              ))}
              {items.length === 0 && <li className="freq-empty">還沒有常用項目</li>}
            </ul>
          </div>

          <Accordion title="進階設定">
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
                placeholder="Enter your secret TOKEN here"
                autoComplete="off"
              />
            </label>
          </Accordion>

          <div className="check-row">
            <button className="check-update" onClick={handleCheckUpdate} disabled={checking}>
              {checking ? '檢查中…' : '檢查更新'}
            </button>
            {checkMsg && <span className="check-msg">{checkMsg}</span>}
          </div>

          <div className="settings-copyright">
            Pudget 記帳布 · v{APP_VERSION}
            <br />© 2026 Fay Hsieh
          </div>
        </div>

        <div className="settings-foot">
          <Button onClick={save}>儲存</Button>
        </div>
      </div>
    </div>
  )
}
