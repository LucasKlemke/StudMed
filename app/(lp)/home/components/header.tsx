'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Menu, X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StudMedLogo } from '@/components/studmed-logo'

const Header = ({
  mounted,
  theme,
  toggleTheme,
  isScrolled,
  setMobileMenuOpen,
  mobileMenuOpen,
}: {
  mounted: boolean
  theme: string | undefined
  toggleTheme: () => void
  isScrolled: boolean
  setMobileMenuOpen: (open: boolean) => void
  mobileMenuOpen: boolean
}) => {
  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${
        isScrolled ? 'bg-background/80 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <StudMedLogo className="w-6 h-6 lg:w-10 lg:h-10 text-primary" />
          </Link>
        </div>
        <nav className="hidden md:flex flex-1 justify-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Funcionalidades
          </Link>

          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Preço
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </nav>

        <div className="hidden md:flex flex-1 justify-end items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
            <span className="sr-only">Mudar tema</span>
          </Button>

          <Link href="/chat">
            <Button className="rounded-full">
              Entrar
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {mounted && theme === 'dark' ? (
              <Sun className="size-[18px]" />
            ) : (
              <Moon className="size-[18px]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b z-40"
        >
          <div className="container px-4 py-4 flex flex-col gap-4">
            <Link
              href="#features"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link
              href="#pricing"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Preço
            </Link>
            <Link
              href="#faq"
              className="py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t mt-2">
              <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>
                <Button className="rounded-full w-full">
                  Entrar
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default Header
