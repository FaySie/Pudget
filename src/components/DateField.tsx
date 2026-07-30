import { IconCalendar } from '@tabler/icons-react'
import { todayLocal } from '../lib/config'

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
}

/** 日期欄，預設今天可改；右側「今天」為可點按鈕，一鍵回到今天 */
export function DateField({ value, onChange }: DateFieldProps) {
  const today = todayLocal()
  const isToday = value === today
  return (
    <div className="field">
      <span className="field__label">日期</span>
      <div className="datefield">
        <span className="icon-filled datefield__icon">
          <IconCalendar size={20} stroke={1.8} />
        </span>
        <input
          className="datefield__input"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value || today)}
        />
        <button
          type="button"
          className={`datefield__today ${isToday ? 'is-current' : ''}`}
          onClick={() => onChange(today)}
          aria-label="設為今天"
        >
          今天
        </button>
      </div>
    </div>
  )
}
