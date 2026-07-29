interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

/** 開關（對齊 Figma Toggle Off/On；用於需先結清） */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  )
}
