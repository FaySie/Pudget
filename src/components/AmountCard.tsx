interface AmountCardProps {
  value: string
  onChange: (value: string) => void
}

/** 正規化金額輸入:純整數（不收小數點），去掉開頭多餘的 0（避免 00200） */
function normalizeAmount(raw: string): string {
  return raw.replace(/[^0-9]/g, '').replace(/^0+/, '')
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
          inputMode="numeric"
          pattern="[0-9]*"
          enterKeyHint="done"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(normalizeAmount(e.target.value))}
          aria-label="金額"
        />
      </div>
    </div>
  )
}
