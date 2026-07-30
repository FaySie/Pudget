import { useState, useEffect } from 'react'
import { RecordScreen } from './screens/RecordScreen'
import { TabBar, type Tab } from './components/TabBar'
import { flushQueue } from './lib/queue'

export function App() {
  const [tab, setTab] = useState<Tab>('record')

  // 一開啟 App、或重新連上網路，就嘗試把離線佇列補送出去
  useEffect(() => {
    flushQueue()
    const onOnline = () => flushQueue()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])

  return (
    <div className="phone">
      {tab === 'record' ? (
        <RecordScreen />
      ) : (
        <div className="scroll placeholder">
          <p className="placeholder__title">📖 紀錄頁開發中</p>
          <p className="placeholder__sub">這裡會顯示這支手機的「待同步 / 已同步」紀錄</p>
        </div>
      )}
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
