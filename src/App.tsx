import { MotionProvider } from './components/motion/MotionProvider'
import { lazy, Suspense } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { FloatingCta } from './components/layout/FloatingCta'
import { HeroSection } from './components/sections/HeroSection'
import { StructuredData } from './components/seo/StructuredData'
import { YandexMetrika } from './components/analytics/YandexMetrika'
import { VisitTracker } from './components/analytics/VisitTracker'

const BenefitsSection = lazy(() =>
  import('./components/sections/BenefitsSection').then((m) => ({ default: m.BenefitsSection })),
)
const CatalogSection = lazy(() =>
  import('./components/sections/CatalogSection').then((m) => ({ default: m.CatalogSection })),
)
const ProcessSection = lazy(() =>
  import('./components/sections/ProcessSection').then((m) => ({ default: m.ProcessSection })),
)
const DeliverySection = lazy(() =>
  import('./components/sections/DeliverySection').then((m) => ({ default: m.DeliverySection })),
)
const RequestFormSection = lazy(() =>
  import('./components/sections/RequestFormSection').then((m) => ({ default: m.RequestFormSection })),
)
const ContactsSection = lazy(() =>
  import('./components/sections/ContactsSection').then((m) => ({ default: m.ContactsSection })),
)
const FaqSection = lazy(() =>
  import('./components/sections/FaqSection').then((m) => ({ default: m.FaqSection })),
)

function SectionFallback() {
  return <div className="min-h-[200px]" aria-hidden="true" />
}

export default function App() {
  return (
    <MotionProvider>
      <div className="overflow-x-hidden bg-white text-[#142033]">
        <StructuredData />
        <YandexMetrika />
        <VisitTracker />
        <Header />

        <main id="top">
          <HeroSection />
          <Suspense fallback={<SectionFallback />}>
            <BenefitsSection />
            <CatalogSection />
            <ProcessSection />
            <DeliverySection />
            <RequestFormSection />
            <ContactsSection />
            <FaqSection />
          </Suspense>
        </main>

        <Footer />
        <FloatingCta />
      </div>
    </MotionProvider>
  )
}
