'use client'

import { motion } from 'framer-motion'
import {
  NotebookPen,
  FileInput,
  FilePlus,
  BrainCircuit,
  BookCopy,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'

const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }
  const t = useTranslations('Home.Features')

  const features = [
    {
      title: t('featureTitle1'),
      description: t('featureDescription1'),
      icon: <NotebookPen className="size-5" />,
      color:
        'from-blue-500/20 to-blue-600/20 text-blue-600 dark:from-blue-400/10 dark:to-blue-500/10 dark:text-blue-400',
    },
    {
      title: t('featureTitle2'),
      description: t('featureDescription2'),
      icon: <BookCopy className="size-5" />,
      color:
        'from-purple-500/20 to-purple-600/20 text-purple-600 dark:from-purple-400/10 dark:to-purple-500/10 dark:text-purple-400',
    },
    {
      title: t('featureTitle3'),
      description: t('featureDescription3'),
      icon: <FileInput className="size-5" />,
      color:
        'from-green-500/20 to-green-600/20 text-green-600 dark:from-green-400/10 dark:to-green-500/10 dark:text-green-400',
    },
    {
      title: t('featureTitle4'),
      description: t('featureDescription4'),
      icon: <FilePlus className="size-5" />,
      color:
        'from-amber-500/20 to-amber-600/20 text-amber-600 dark:from-amber-400/10 dark:to-amber-500/10 dark:text-amber-400',
    },
    {
      title: t('featureTitle5'),
      description: t('featureDescription5'),
      icon: <BrainCircuit className="size-5" />,
      color:
        'from-red-500/20 to-red-600/20 text-red-600 dark:from-red-400/10 dark:to-red-500/10 dark:text-red-400',
    },
  ]
  return (
    <section
      id="features"
      className="relative w-full py-20 sm:py-24 md:py-36 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)_4rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)_4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
        >
          <Badge className="rounded-full px-5 py-1.5 text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            {t('badge')}
          </Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance">
            {t('title')}
          </h2>
          <p className="max-w-[800px] text-muted-foreground text-base sm:text-lg md:text-xl text-balance">
            {t('description')}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={item}>
              <Card className="h-full overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1 group">
                <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                  <div
                    className={`size-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features
