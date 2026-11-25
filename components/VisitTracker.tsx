'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

function getSessionId(): string {
  try {
    let id = localStorage.getItem('visit_sid')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('visit_sid', id)
    }
    return id
  } catch {
    return crypto.randomUUID()
  }
}

const SKIP_PREFIXES = ['/api', '/_next', '/admin']

export default function VisitTracker() {
  const pathname = usePathname()
  const lastSent = useRef<string>('')

  useEffect(() => {
    if (!pathname) return
    if (SKIP_PREFIXES.some(p => pathname.startsWith(p))) return
    if (lastSent.current === pathname) return
    lastSent.current = pathname

    const send = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: getSessionId(),
            user_id: user?.id ?? null,
            path: pathname,
            referrer: document.referrer || null,
            screen: `${window.screen.width}x${window.screen.height}`,
          }),
          keepalive: true,
        })
      } catch {}
    }
    send()
  }, [pathname])

  return null
}
