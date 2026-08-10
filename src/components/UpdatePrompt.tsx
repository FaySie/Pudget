import { usePwaUpdate } from './PwaUpdateProvider'

/** 偵測到新版時，畫面下方跳出的更新橫幅（點更新會重新載入、保留設定） */
export function UpdatePrompt() {
  const { needRefresh, applyUpdate } = usePwaUpdate()
  if (!needRefresh) return null
  return (
    <div className="update-bar" role="status">
      <span className="update-bar__text">有新版本可以更新</span>
      <button className="update-bar__btn" onClick={applyUpdate}>
        更新
      </button>
    </div>
  )
}
