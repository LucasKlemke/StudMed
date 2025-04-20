'use client'

import Hero from './hero'
import Features from './features'
import HowItWorks from './how-it-works'
import Pricing from './pricing'
import FAQ from './faq'
import CTA from './cta'

const Main = () => {
  return (
    <main className="flex-1 ">
      {/* Hero Section */}
      <Hero />

      {/* Logos Section Por enquanto sem kkkk */}
      {/* <section className="w-full py-12 border-y bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Utilizado por estudantes de medicina em todo o Brasil
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
              {[1, 2, 3, 4, 5].map((i) => (
                <Image
                  key={i}
                  src={`/placeholder-logo.svg`}
                  alt={`Company logo ${i}`}
                  width={120}
                  height={60}
                  className="h-8 w-auto opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Pricing Section */}
      <Pricing />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <CTA />
    </main>
  )
}

export default Main
