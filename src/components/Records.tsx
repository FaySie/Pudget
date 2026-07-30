import { IconX, IconFileDescription } from '@tabler/icons-react'

/** 紀錄頁（從右上角 history 圖示開啟）。目前為佔位，之後放「待同步 / 已同步」清單。 */
export function Records({ onClose }: { onClose: () => void }) {
  return (
    <div className="settings-overlay" role="dialog" aria-label="紀錄">
      <div className="settings-sheet">
        <div className="settings-head">
          <span className="settings-title font-round">紀錄</span>
          <button className="settings-close icon-muted" onClick={onClose} aria-label="關閉">
            <IconX size={22} stroke={1.8} />
          </button>
        </div>
        <div className="settings-body placeholder">
          <span className="icon-muted placeholder__icon">
            <IconFileDescription size={40} stroke={1.6} />
          </span>
          <p className="placeholder__title">紀錄頁開發中</p>
          <p className="placeholder__sub">這裡會顯示這支手機的「待同步 / 已同步」紀錄</p>
        </div>
      </div>
    </div>
  )
}
