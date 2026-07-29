import { IconPencilPlus, IconFileDescription } from '@tabler/icons-react'

export type Tab = 'record' | 'log'

interface TabBarProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { key: Tab; label: string; Icon: typeof IconPencilPlus }[] = [
  { key: 'record', label: '記帳', Icon: IconPencilPlus },
  { key: 'log', label: '紀錄', Icon: IconFileDescription },
]

/** 底部導覽（對齊 Figma TabItem Active/Inactive） */
export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="tabbar">
      {TABS.map(({ key, label, Icon }) => {
        const on = active === key
        return (
          <button
            key={key}
            type="button"
            className={`tab ${on ? 'tab--active' : ''}`}
            aria-current={on ? 'page' : undefined}
            onClick={() => onChange(key)}
          >
            <span className={on ? 'icon-filled' : 'icon-muted'}>
              <Icon size={23} stroke={1.8} />
            </span>
            {label}
          </button>
        )
      })}
    </nav>
  )
}
