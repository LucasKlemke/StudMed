'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Header from './components/header'
import Main from './components/main'
import Footer from './components/footer'
import { useSession } from 'next-auth/react'

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen overflow-scroll flex-col scroll-smooth">
      <Header
        mounted={mounted}
        theme={theme}
        toggleTheme={toggleTheme}
        isScrolled={isScrolled}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileMenuOpen={mobileMenuOpen}
      />
      <Main />
      <Footer />
    </div>
  )
}
