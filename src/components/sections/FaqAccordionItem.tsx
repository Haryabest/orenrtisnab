import { AnimatePresence, m } from 'framer-motion'
import { Icon } from '../Icon/Icon'
import { easeOut } from '../motion/variants'

type FaqAccordionItemProps = {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

export function FaqAccordionItem({ question, answer, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <m.div
      layout
      className={`overflow-hidden rounded-2xl border bg-white transition-colors duration-300 ${
        isOpen
          ? 'border-blue-200 shadow-[0_8px_24px_rgba(16,45,80,.06)]'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-extrabold leading-snug text-[#102d50]">{question}</span>

        <m.span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
            isOpen ? 'bg-[#0875e1] text-white' : 'bg-[#eef4f9] text-[#0875e1]'
          }`}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: easeOut }}
        >
          <Icon name="chevron" size={16} stroke={2.2} />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="overflow-hidden"
          >
            <m.p
              className="px-5 pb-5 text-[13px] leading-relaxed text-slate-600"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              exit={{ y: -8 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              {answer}
            </m.p>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  )
}
