/** 布丁吉祥物（用 public/pudget_mascot.png） */
export function Mascot({ size = 36 }: { size?: number }) {
  return (
    <img
      src={import.meta.env.BASE_URL + 'pudget_mascot.png'}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{ display: 'block', flex: 'none' }}
    />
  )
}
