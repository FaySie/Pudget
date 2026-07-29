interface AmountCardProps {
  value: string
  onChange: (value: string) => void
}

/** 金額主角卡（亮黃底，Fredoka/圓體大數字） */
export function AmountCard({ value, onChange }: AmountCardProps) {
  return (
    <div className="amount-card">
      <div className="amount-card__label">金額</div>
      <div className="amount-card__row">
        <span className="amount-card__cur">NT$</span>
        <input
          className="amount-card__val"
          inputMode="decimal"
          enterKeyHint="done"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
          aria-label="金額"
        />
      </div>
    </div>
  )
}
