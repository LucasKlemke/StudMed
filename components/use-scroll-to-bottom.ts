import { useEffect, useRef, type RefObject } from 'react'

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>
] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  const shouldNotScroll = (mutations: MutationRecord[]): boolean => {
    return mutations.some((mutation) => {
      const target = mutation.target as HTMLElement
      return target.closest('.no-scroll') !== null
    })
  }

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current

   if (container && end) {
     const observer = new MutationObserver((mutations) => {
       if (shouldNotScroll(mutations)) {
         return
       }
       end.scrollIntoView({ behavior: 'instant', block: 'end' })
     })

     observer.observe(container, {
       childList: true,
       subtree: true,
       attributes: true,
       characterData: true,
     })

     return () => observer.disconnect()
   }
  }, [])

  return [containerRef, endRef]
}

