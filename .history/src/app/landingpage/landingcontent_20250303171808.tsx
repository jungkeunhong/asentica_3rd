import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LandingPageProps {
  onStartQuiz?: () => void
}

const LandingPage = ({ onStartQuiz }: LandingPageProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const router = useRouter()
  
  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const scale = useTransform(scrollY, [0, 100], [1, 0.95])
  
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 100
      setIsScrolled(show)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleStartQuiz = async () => {
    if (typeof window !== 'undefined') {
      const { trackPageView } = await import('@/utils/firebase')
      await trackPageView('quiz-intro')
    }
    router.push('/quiz-intro')
  }

  return (
    <div className="relative min-h-screen bg-[#1A1A1A] font-cormorant">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <video
          src="/0214.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        {/* Hero Section */}
        <motion.div 
          className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ opacity, scale }}
        >
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 leading-relaxed">
            Your Skin, Your Match
          </h1>
          <h2 className="text-lg md:text-xl font-light text-white/80 max-w-xl mb-12 leading-relaxed">
            Stop spending hours researching clinics.<br />
            We'll find your perfect match.
          </h2>
          <motion.button
            onClick={handleStartQuiz}
            className="bg-white/90 text-[#1A1A1A] px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg">Find your Match</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

          <motion.div
            className="mt-8"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDown className="w-6 h-6 text-white/80" />
          </motion.div>
        </motion.div>

        {/* Description Section */}
        <div className="bg-white flex flex-col justify-center px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8 leading-relaxed">
              The easiest way to find<br />your perfect clinic
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-light text-[#1A1A1A] mb-3">We understand you</h3>
                <h4 className="text-lg text-[#1A1A1A]/70 font-light leading-relaxed max-w-2xl">
                  Tell us about your skin goals. We'll listen and guide you to the right treatment.
                </h4>
              </div>
              <div>
                <h3 className="text-2xl font-light text-[#1A1A1A] mb-3">Trust and safety first</h3>
                <h4 className="text-lg text-[#1A1A1A]/70 font-light leading-relaxed max-w-2xl">
                  Every clinic in our network is carefully selected and verified for your peace of mind.
                </h4>
              </div>
              <div>
                <h3 className="text-2xl font-light text-[#1A1A1A] mb-3">Made for you</h3>
                <h4 className="text-lg text-[#1A1A1A]/70 font-light leading-relaxed max-w-2xl">
                  Get treatment recommendations that match your unique needs and preferences.
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.button
        onClick={handleStartQuiz}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 z-50 ${
          isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-base">Find your match</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>

      <ScrollToTop />
    </div>
  )
}

export default LandingPage 