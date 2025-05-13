import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { StudMedLogo } from '@/components/studmed-logo'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Home.Footer')

  const footerLinks = [
    {
      title: t('footerLinkTitle1'),
      links: [
        { name: t('footerLinkTitle1Name1'), href: '#features' },
        { name: t('footerLinkTitle1Name2'), href: '#pricing' },
      ],
    },
    {
      title: t('footerLinkTitle2'),
      links: [{ name: t('footerLinkTitle2Name1'), href: '#' }],
    },
    {
      title: t('footerLinkTitle3'),
      links: [
        { name: t('footerLinkTitle3Name1'), href: '#' },
        { name: t('legalLinkName1'), href: '#' },
        { name: t('legalLinkName2'), href: '#' },
      ],
    },
  ]

  const legalLinks = [
    { name: t('legalLinkName1'), href: '#' },
    { name: t('legalLinkName2'), href: '#' },
    { name: t('legalLinkName3'), href: '#' },
  ]
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-[100rem] px-6 py-12 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <StudMedLogo className="h-8 w-8 text-primary" />
              <span className="text-lg">Studmed</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/studmed.ai/"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </Link>
            </div>
          </div>

          {/* Navigation links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold tracking-wide">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section with copyright and legal links */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Studmed. {t('allRights')}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
