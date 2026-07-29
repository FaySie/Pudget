import { useState, type ReactNode } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface AccordionProps {
  title: string
  children: ReactNode
  /** 顯示紅點提示（例如已開啟需先結清） */
  dot?: boolean
  defaultOpen?: boolean
}

/** 可收合區塊（對齊 Figma Accordion Closed/Open），預設關閉 */
export function Accordion({ title, children, dot, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`accordion ${open ? 'accordion--open' : ''}`}>
      <button
        type="button"
        className="accordion__head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        {dot && <span className="accordion__dot" aria-hidden="true" />}
        <span className="accordion__chev icon-muted">
          <IconChevronDown size={18} stroke={2} />
        </span>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  )
}
