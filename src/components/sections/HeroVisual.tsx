import { m } from 'framer-motion'
import { useContent } from '../../context/ContentContext'
import { scaleIn } from '../motion/variants'

export function HeroVisual() {
  const { content } = useContent()
  const { heroVisual } = content

  return (
    <m.div
      className="relative min-h-[390px] overflow-hidden rounded-[28px] bg-[#102d50] shadow-[0_24px_60px_rgba(16,45,80,.22)] md:min-h-[500px]"
      aria-hidden="true"
      variants={scaleIn}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 550"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hero-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d2949" />
            <stop offset="100%" stopColor="#102d50" />
          </linearGradient>
          <radialGradient id="hero-glow" cx="70%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#228cff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#228cff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="550" fill="url(#hero-bg)" />
        <rect width="600" height="550" fill="url(#hero-glow)" />
        <circle cx="480" cy="90" r="110" fill="none" stroke="#a8bbca" strokeOpacity="0.45" strokeWidth="24" />
        <circle cx="500" cy="420" r="70" fill="none" stroke="#0875e1" strokeOpacity="0.35" strokeWidth="16" />
        <circle cx="420" cy="380" r="42" fill="none" stroke="#102d50" strokeWidth="10" />
        <g opacity="0.15">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="550" stroke="#fff" strokeWidth="1" />
          ))}
        </g>
      </svg>

      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(7,31,57,.1),rgba(7,31,57,.78))]" />

      <m.div
        className="absolute bottom-9 left-7 right-7 rounded-2xl border border-white/20 bg-[#0d2949]/75 p-5 backdrop-blur-md supports-[backdrop-filter]:bg-[#0d2949]/75"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="font-mono text-[10px] tracking-[.14em] text-[#83c6ff]">{heroVisual.eyebrow}</p>
        <p className="mt-2 max-w-[340px] text-[17px] font-bold leading-snug text-white">{heroVisual.text}</p>
      </m.div>
    </m.div>
  )
}
