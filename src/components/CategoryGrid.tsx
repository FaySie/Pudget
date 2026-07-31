import { CATEGORIES } from '../data/categories'

interface CategoryGridProps {
  value: string | null
  onChange: (label: string) => void
}

/** 類別 12 宮格（對齊 Figma CategoryChip Default/Selected + 可交換 icon） */
export function CategoryGrid({ value, onChange }: CategoryGridProps) {
  return (
    <div className="field">
      <span className="field__label">類別</span>
      <div className="cats">
        {CATEGORIES.map(({ label, Icon }) => {
          const selected = value === label
          return (
            <button
              key={label}
              type="button"
              className={`chip ${selected ? 'chip--selected' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(label)}
            >
              <span className="icon-filled chip__icon">
                <Icon size={24} stroke={1.5} />
              </span>
              <span className="chip__label">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
