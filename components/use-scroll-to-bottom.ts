import { useEffect, useRef, type RefObject } from 'react'

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T>,
  RefObject<T>
] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  // Checks if any mutation occurred in an element with the class "no-scroll"
  const shouldNotScroll = (mutations: MutationRecord[]): boolean => {
    return mutations.some((mutation) => {
      // Ensure the mutation target is an Element
      if (!(mutation.target instanceof Element)) return false
      return mutation.target.closest('.no-scroll') !== null
    })
  }

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current

    if (container && end) {
      const observer = new MutationObserver((mutations) => {
        // If the mutation occurred in an element with "no-scroll", do not scroll
        if (shouldNotScroll(mutations)) return

        // Perform the scroll automatically
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
