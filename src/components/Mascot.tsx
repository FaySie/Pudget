/** 布丁吉祥物（SVG，與 Figma 一致） */
export function Mascot({ size = 46 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <ellipse cx="24" cy="41" rx="18" ry="3.4" fill="#F3E4C0" />
      <ellipse cx="24" cy="40" rx="14.5" ry="2.4" fill="#FFF8E8" />
      <path
        d="M13 20 C13 12 35 12 35 20 L38 33 C38.6 36.6 36 39 32.4 39 L15.6 39 C12 39 9.4 36.6 10 33 Z"
        fill="#FBC63E"
      />
      <rect x="16" y="26" width="2.3" height="6.5" rx="1.15" fill="#FFDC7E" />
      <circle cx="17.15" cy="35" r="1.15" fill="#FFDC7E" />
      <path
        d="M13 20 C13 12.5 35 12.5 35 20 L35.2 22.4 C33 24 32 20.8 29.5 22.8 C27 24.8 26.4 21.2 24 22.8 C21.5 24.4 21 20.9 18.5 22.8 C16.6 24.3 15 21.6 12.8 22.4 Z"
        fill="#6E4020"
      />
      <circle cx="20.6" cy="29" r="1.5" fill="#4A2C13" />
      <circle cx="27.4" cy="29" r="1.5" fill="#4A2C13" />
      <path
        d="M21.6 32.4 Q24 34.8 26.4 32.4"
        fill="none"
        stroke="#4A2C13"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}
