import NavLan from '../landingcomponents/NavLan'
import HeroSection from '../landingcomponents/Herosection'
import FeaturesSection from '../landingcomponents/Featuresection'
import HowItWorks from '../landingcomponents/Howitworks'
import Testimonials from '../landingcomponents/Testimonial'
import CtaSection from '../landingcomponents/Ctasection'
import Footer from '../landingcomponents/Footer'
import GsapAmbient from '../components/visuals/GsapAmbient'

export default function LanApp() {
  return (
    <div className="landing-page relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-[#f5f1eb] via-[#faf8f5] to-[#f5f1eb]" style={{ '--text': '#1f1817', '--text-2': '#6b6b6b', '--text-3': '#999999', '--accent': '#ff5c35', '--accent-2': '#f0a500', '--accent-soft': 'rgba(255, 92, 53, 0.1)', '--surface-3': 'rgba(0, 0, 0, 0.04)', '--line': 'rgba(0, 0, 0, 0.08)', '--shadow': '0 12px 32px rgba(31, 23, 9, 0.08)' }}>
      <GsapAmbient variant="landing" />
      <NavLan />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CtaSection />
      <Footer />
    </div>
  )
}
