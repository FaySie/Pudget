import type { Icon as TablerIcon } from '@tabler/icons-react'

interface FilledIconProps {
  icon: TablerIcon
  size?: number
  strokeWidth?: number
  className?: string
}

/**
 * 黑線 + 黃填的 icon。用兩層堆疊:
 *  下層只填色(--icon-fill)當底、上層只畫線條(--icon-stroke)。
 * 這樣填色不會蓋掉 icon 內部的細節(例如餅乾中間的黑點)。
 * 深色模式下 --icon-fill 設為 transparent，自動變成「只有線條」。
 */
export function FilledIcon({ icon: Icon, size = 24, strokeWidth = 1.5, className = '' }: FilledIconProps) {
  return (
    <span className={`filled-icon ${className}`} style={{ width: size, height: size }}>
      <Icon size={size} className="fi-fill" aria-hidden />
      <Icon size={size} stroke={strokeWidth} className="fi-line" aria-hidden />
    </span>
  )
}
