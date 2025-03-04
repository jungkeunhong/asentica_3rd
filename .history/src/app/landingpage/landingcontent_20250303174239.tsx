"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// ScrollToTop 컴포넌트 정의
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <motion.button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 bg-amber-900 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  )
}

const LandingContent = () => {
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

  const handleFindMedspa = () => {
    router.push('/search')
  }

  return (
    <div className="relative bg-white font-cormorant">
      {/* Video Background */}
      <div className="relative w-full h-[70vh]">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video
          src="/videos/0214.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Hero Content */}
        <motion.div 
          className="absolute inset-0 z-20 flex flex-col items-center justify-center px-2 text-center"
          style={{ opacity, scale }}
        >
          <h1 className="cormorant text-3xl md:text-6xl font-light text-white mt-8 mb-6 leading-tight">
            Your Skin, Your Match
          </h1>
          <h2 className="text-lg md:text-xl font-light text-white/80 max-w-xl mb-12">
            Find & Book the Best MedSpas in NYC<br />
            Stop spending hours researching clinics.<br />
            We&apos;ll find your perfect match.
          </h2>
          <motion.button
            onClick={handleFindMedspa}
            className="bg-amber-900 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
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
      </div>

      {/* Description Section */}
      <div className="bg-white flex flex-col justify-center px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light text-amber-900 mb-8 leading-relaxed text-center">
            The easiest way to find<br />your perfect medspa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Image 
                    src="/icons/star.svg" 
                    alt="Star icon" 
                    width={32} 
                    height={32} 
                  />
                </div>
              </div>
              <h3 className="text-xl font-medium text-amber-900 mb-3 text-center">We understand you</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                Tell us about your skin goals. We&apos;ll listen and guide you to the right treatment.
              </p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Image 
                    src="/icons/thumbup.svg" 
                    alt="Thumbs up icon" 
                    width={32} 
                    height={32} 
                  />
                </div>
              </div>
              <h3 className="text-xl font-medium text-amber-900 mb-3 text-center">Trust and safety first</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                Every medspa in our network is carefully selected and verified for your peace of mind.
              </p>
            </div>
            <div className="bg-amber-50 p-6 rounded-lg shadow-sm">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Image 
                    src="/icons/phone.svg" 
                    alt="Phone icon" 
                    width={32} 
                    height={32} 
                  />
                </div>
              </div>
              <h3 className="text-xl font-medium text-amber-900 mb-3 text-center">Made for you</h3>
              <p className="text-gray-700 leading-relaxed text-center">
                Get treatment recommendations that match your unique needs and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.button
        onClick={handleFindMedspa}
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-900 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 z-50 ${
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

export default LandingContent