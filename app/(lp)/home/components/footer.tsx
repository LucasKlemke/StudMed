import Link from "next/link"
import { Instagram } from "lucide-react"
import { StudMedLogo } from '@/components/studmed-logo'

const footerLinks = [
  {
    title: "Produto",
    links: [
      { name: "Funcionalidades", href: "#features" },
      { name: "Preço", href: "#pricing" },
    ],
  },
  {
    title: "Recursos",
    links: [{ name: "Suporte", href: "#" }],
  },
  {
    title: "Empresa",
    links: [
      { name: "Sobre", href: "#" },
      { name: "Política de Privacidade", href: "#" },
      { name: "Termos de Serviço", href: "#" },
    ],
  },
]

const legalLinks = [
  { name: "Política de Privacidade", href: "#" },
  { name: "Termos de Serviço", href: "#" },
  { name: "Política de Cookies", href: "#" },
]

export default function Footer() {
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
              Otimize seus estudos de medicina com nossa plataforma de IA. Melhore seu desempenho e prepare-se para
              provas com eficiência.
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
              <h4 className="text-sm font-semibold tracking-wide">{section.title}</h4>
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
            &copy; {new Date().getFullYear()} Studmed. Todos os direitos reservados.
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
