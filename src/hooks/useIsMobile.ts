import { useEffect, useState } from 'react'

// The public site's design is a fixed, pixel-perfect desktop layout ported
// from the approved .dc.html mockup (see src/lib/style.ts). Nothing in that
// contract addresses phone widths, so components that need to behave
// differently below `breakpoint` (currently just the nav — see Nav.tsx)
// check this instead of adding CSS media queries the sx() helper can't
// express.
export function useIsMobile(breakpoint = 860): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return isMobile
}
