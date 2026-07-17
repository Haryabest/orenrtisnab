import { useState } from 'react'
import { m } from 'framer-motion'
import { useContent } from '../../context/ContentContext'
import { fadeUp, staggerContainer, viewport } from '../motion/variants'
import { FaqAccordionItem } from './FaqAccordionItem'

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const { content } = useContent()
  const { faq } = content

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index))
  }

  return (
    <section id="faq" className="bg-[#f5f7f9]" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1220px] px-5 py-20 lg:px-8">
        <m.div initial="hidden" whileInView="visible" viewport={viewport} variants={staggerContainer}>
          <m.p className="font-mono text-[10px] tracking-[.16em] text-[#0875e1]" variants={fadeUp}>
            {faq.eyebrow}
          </m.p>
          <m.h2
            id="faq-heading"
            className="mt-3 text-[31px] font-extrabold tracking-[-.055em] text-[#102d50] md:text-[40px]"
            variants={fadeUp}
          >
            {faq.heading}
          </m.h2>
        </m.div>

        <m.div
          className="mt-10 space-y-3"
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={staggerContainer}
        >
          {faq.items.map((item, index) => (
            <m.div key={item.question} variants={fadeUp}>
              <FaqAccordionItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}
