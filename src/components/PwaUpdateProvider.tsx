import { createContext, useContext, useRef, useState, type ReactNode } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

type CheckResult = 'updated' | 'latest' | 'error'

interface PwaUpdateValue {
  needRefresh: boolean
  applyUpdate: () => void
  checkForUpdate: () => Promise<CheckResult>
  checking: boolean
}

const PwaUpdateContext = createContext<PwaUpdateValue | null>(null)

export function usePwaUpdate(): PwaUpdateValue {
  const v = useContext(PwaUpdateContext)
  if (!v) throw new Error('usePwaUpdate must be used inside PwaUpdateProvider')
  return v
}

export function PwaUpdateProvider({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(false)
  const regRef = useRef<ServiceWorkerRegistration | undefined>(undefined)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      regRef.current = registration || undefined
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000)
    },
  })

  async function checkForUpdate(): Promise<CheckResult> {
    const reg = regRef.current
    if (!reg) return 'error'
    setChecking(true)
    try {
      await reg.update()
      await new Promise((res) => setTimeout(res, 1000))
      return reg.waiting || reg.installing ? 'updated' : 'latest'
    } catch {
      return 'error'
    } finally {
      setChecking(false)
    }
  }

  return (
    <PwaUpdateContext.Provider
      value={{ needRefresh, applyUpdate: () => updateServiceWorker(true), checkForUpdate, checking }}
    >
      {children}
    </PwaUpdateContext.Provider>
  )
}
