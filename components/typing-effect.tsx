'use client'

import * as React from 'react'
import { motion, useInView } from 'framer-motion'

export function TypingEffect({ text = 'Typing Effect' }: { text: string }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <h2
      ref={ref}
      className="text-xl text-center sm:text-4xl tracking-tighter md:text-5xl md:leading-[4rem]"
    >
      {text.split('').map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          {letter}
        </motion.span>
      ))}
    </h2>
  )
}
