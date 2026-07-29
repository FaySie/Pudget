import { IconCalendar } from '@tabler/icons-react'
import { todayLocal } from '../lib/config'

interface DateFieldProps {
  value: string
  onChange: (value: string) => void
}

/** 日期欄，預設今天可改（native date input） */
export function DateField({ value, onChange }: DateFieldProps) {
  const isToday = value === todayLocal()
  return (
    <label className="field">
      <span className="field__label">日期</span>
      <span className="datefield">
        <span className="icon-filled datefield__icon">
          <IconCalendar size={20} stroke={1.8} />
        </span>
        <input
          className="datefield__input"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isToday && <span className="datefield__tag">今天</span>}
      </span>
    </label>
  )
}
