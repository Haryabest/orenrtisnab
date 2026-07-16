import type { IconName } from './types'

type IconProps = {
  name: IconName
  size?: number
  stroke?: number
}

const paths: Record<IconName, React.ReactNode> = {
  check: <path d="m5 12 4.2 4.2L19.5 6" />,
  arrow: (
    <>
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  box: (
    <>
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="M3 7v10l9 4 9-4V7M12 11v10" />
    </>
  ),
  bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
  measure: (
    <>
      <path d="M3 21 21 3" />
      <path d="m14 3 7 7M3 14l7 7" />
      <path d="m7 17 2 2m1-5 2 2m1-5 2 2" />
    </>
  ),
  document: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </>
  ),
  handshake: (
    <>
      <path d="m8.5 11.5 3 3a2.1 2.1 0 0 0 3-3L12 9" />
      <path d="m3 9 4-4 4 2h3l3-2 4 4-4 4" />
      <path d="m5 13 3 3m0-1 2 2m1-1 2 2" />
    </>
  ),
  phone: (
    <path d="M21 16.5v3a1.5 1.5 0 0 1-1.65 1.5 17.8 17.8 0 0 1-7.77-2.76 17.4 17.4 0 0 1-5.36-5.36A17.8 17.8 0 0 1 3.46 5.1 1.5 1.5 0 0 1 4.95 3.45h3A1.5 1.5 0 0 1 9.45 4.7c.1.76.28 1.5.53 2.22a1.5 1.5 0 0 1-.34 1.58L8.37 9.77a14.8 14.8 0 0 0 5.86 5.86l1.27-1.27a1.5 1.5 0 0 1 1.58-.34c.72.25 1.46.43 2.22.53A1.5 1.5 0 0 1 21 16.5Z" />
  ),
  telegram: <path d="m21 4-3.2 16-6-4.2-3.2 3.2.7-4.8L4 12 21 4Zm-11.7 9.4L18 6.3 10.8 12" />,
  truck: (
    <>
      <path d="M3 5h11v11H3zM14 9h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  package: (
    <>
      <path d="m3 7 9-4 9 4v10l-9 4-9-4Z" />
      <path d="m3 7 9 4 9-4M12 11v10" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4Zm16 0h-3v5h2a1 1 0 0 0 1-1v-4Z" />
      <path d="M17 19c0 2-2 3-5 3" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
}

export function Icon({ name, size = 20, stroke = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
