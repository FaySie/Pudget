import { useRegisterSW } from 'virtual:pwa-register/react'

/**
 * 版本更新提示。偵測到新版 Service Worker 時，畫面下方跳出橫幅，
 * 點「更新」會重新載入套用新版（不需重裝，localStorage 設定保留）。
 * 另外每小時自動檢查一次新版。
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })

  if (!needRefresh) return null

  return (
    <div className="update-bar" role="status">
      <span className="update-bar__text">有新版本可以更新</span>
      <button className="update-bar__btn" onClick={() => updateServiceWorker(true)}>
        更新
      </button>
    </div>
  )
}
