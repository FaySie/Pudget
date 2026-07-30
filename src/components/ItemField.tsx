import { useState, useRef } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface ItemFieldProps {
  value: string
  onChange: (value: string) => void
  /** 常用項目（自訂下拉，仍可自由輸入） */
  suggestions: string[]
}

/** 項目 combobox：自訂下拉（native datalist 在 iOS 顯示不全，改自建） */
export function ItemField({ value, onChange, suggestions }: ItemFieldProps) {
  const [open, setOpen] = useState(false)
  const blurTimer = useRef<number | undefined>(undefined)

  const q = value.trim().toLowerCase()
  const filtered = q ? suggestions.filter((s) => s.toLowerCase().includes(q)) : suggestions

  function pick(s: string) {
    onChange(s)
    setOpen(false)
  }

  return (
    <div className="field">
      <span className="field__label">項目</span>
      <div className="combobox">
        <input
          className="text-input combobox__input"
          type="text"
          placeholder="買了什麼？可從常用挑，或直接打"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 150)
          }}
        />
        <button
          type="button"
          className="combobox__toggle icon-muted"
          tabIndex={-1}
          aria-label="常用項目"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setOpen((o) => !o)}
        >
          <IconChevronDown size={18} stroke={2} />
        </button>
        {open && filtered.length > 0 && (
          <ul className="combobox__list">
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  className="combobox__opt"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
