import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary'
  disabled?: boolean
  type?: 'button' | 'submit'
}

/** 主要按鈕（對齊 Figma Button/Primary） */
export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} font-round`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
