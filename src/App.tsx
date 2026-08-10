import { RecordScreen } from './screens/RecordScreen'
import { UpdatePrompt } from './components/UpdatePrompt'
import { PwaUpdateProvider } from './components/PwaUpdateProvider'

export function App() {
  return (
    <PwaUpdateProvider>
      <div className="phone">
        <RecordScreen />
        <UpdatePrompt />
      </div>
    </PwaUpdateProvider>
  )
}
