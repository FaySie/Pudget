import type { Payer } from '../lib/types'

const PAYERS: Payer[] = ['毛毛', '馥仔', '共用錢包']

interface PayerSegmentProps {
  value: Payer
  onChange: (value: Payer) => void
}

/** 付款人三選一（對齊 Figma PayerItem Default/Selected） */
export function PayerSegment({ value, onChange }: PayerSegmentProps) {
  return (
    <div className="field">
      <span className="field__label">誰付的？</span>
      <div className="segment" role="group" aria-label="付款人">
        {PAYERS.map((p) => (
          <button
            key={p}
            type="button"
            className={`payer font-round ${value === p ? 'payer--selected' : ''}`}
            aria-pressed={value === p}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}
