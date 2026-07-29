interface ItemFieldProps {
  value: string
  onChange: (value: string) => void
  /** 常用項目（下拉建議，仍可自由輸入） */
  suggestions: string[]
}

/** 項目 combobox：可從常用清單挑，也可手動輸入 */
export function ItemField({ value, onChange, suggestions }: ItemFieldProps) {
  return (
    <label className="field">
      <span className="field__label">項目</span>
      <input
        className="text-input"
        type="text"
        list="pudget-frequent-items"
        placeholder="買了什麼？可從常用挑，或直接打"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <datalist id="pudget-frequent-items">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </label>
  )
}
