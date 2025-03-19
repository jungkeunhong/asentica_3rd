"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
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
          <h1 className="cormorant text-3xl md:text-6xl font-light text-white mt-20 mb-6 tracking-tight">
            Your Skin, Your Match
          </h1>
          <p className="system-ui text-base md:text-xl font-light text-white/80 leading-tight max-w-xl mb-12">
            Stop spending hours researching clinics.<br />
            We&apos;ll find your perfect match.
          </p>
          <motion.button
            onClick={handleFindMedspa}
            className="relative bg-gradient-to-b from-zinc-800 to-black 
                text-white px-6 py-3 rounded-full 
                shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_2px_rgba(0,0,0,0.8),4px_4px_20px_rgba(0,0,0,0.5)] 
                hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_2px_rgba(0,0,0,0.8),6px_6px_25px_rgba(0,0,0,0.6)] 
                active:shadow-[inset_-2px_-2px_2px_rgba(255,255,255,0.1),inset_2px_2px_2px_rgba(0,0,0,0.8)] 
                active:translate-y-[0.125rem]
                transition-all duration-200 group
                before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-zinc-800/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center space-x-2">
              <span className="text-lg">Find your Match</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>

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
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 
            bg-gradient-to-b from-zinc-800 to-black 
            text-white px-6 py-3 rounded-full 
            border border-zinc-700
            shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_2px_rgba(0,0,0,0.8),4px_4px_20px_rgba(0,0,0,0.5)] 
            hover:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.2),inset_-2px_-2px_2px_rgba(0,0,0,0.8),6px_6px_25px_rgba(0,0,0,0.6)] 
            active:shadow-[inset_-2px_-2px_2px_rgba(255,255,255,0.1),inset_2px_2px_2px_rgba(0,0,0,0.8)] 
            active:translate-y-[0.125rem]
            transition-all duration-200 
            flex items-center space-x-2 z-50
            before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-zinc-800/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity
            ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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