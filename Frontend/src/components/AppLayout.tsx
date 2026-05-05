import type { ReactNode } from 'react'
import { TopNav } from './TopNav'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:pt-10">{children}</div>
    </div>
  )
}
