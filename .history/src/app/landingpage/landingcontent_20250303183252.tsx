"use client"

import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    className="absolute inset-x-0 top-[20%] z-20 flex flex-col items-center px-2 text-center"
    style={{ opacity, scale }}
  >
    <h1 className="cormorant text-3xl md:text-6xl font-light text-white mb-6 tracking-tight">
      Your Skin, Your Match
    </h1>
    <p className="system-ui text-base md:text-xl font-light text-white/80 leading-tight max-w-xl mb-8">
      Stop spending hours finding clinics.<br />
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
    <p className="system-ui text-base md:text-xl font-light text-white/80 px-3 mt-4 leading-tight max-w-xl mb-8">
      +100 verified MedSpas and practitioners in NYC
    </p>
  </motion.div>
</div>

     {/* Description Section */}
<div className="bg-white flex flex-col justify-center px-6 py-12">
  <div className="max-w-4xl mx-auto">
    <h2 className="cormorant text-3xl md:text-4xl font-light text-zinc-900 mb-12 leading-snug tracking-tight text-center">
      Compare top-rated skin treatments
    </h2>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-b from-zinc-50 to-white p-6 rounded-md
        shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),2px_2px_10px_rgba(0,0,0,0.1)] 
        hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),4px_4px_12px_rgba(0,0,0,0.15)] 
        transition-shadow">
        <p className="system-ui text-lg font-medium text-zinc-800 mb-2">
          Licensed & Verified
        </p>
        <p className="system-ui text-zinc-500 leading-relaxed text-sm">
          Only certified practitioners with proven track records. Your safety comes first.
        </p>
      </div>

      <div className="bg-gradient-to-b from-zinc-50 to-white p-6 rounded-md
        shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),2px_2px_10px_rgba(0,0,0,0.1)] 
        hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),4px_4px_12px_rgba(0,0,0,0.15)] 
        transition-shadow">
        <p className="system-ui text-lg font-medium text-zinc-800 mb-2">
          True Pricing
        </p>
        <p className="system-ui text-zinc-500 leading-relaxed text-sm">
          See actual treatment costs upfront, not just &quot;starting from&quot; prices.
        </p>
      </div>

      <div className="bg-gradient-to-b from-zinc-50 to-white p-6 rounded-md
        shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),2px_2px_10px_rgba(0,0,0,0.1)] 
        hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.5),inset_-1px_-1px_1px_rgba(0,0,0,0.1),4px_4px_12px_rgba(0,0,0,0.15)] 
        transition-shadow">
        <p className="system-ui text-lg font-medium text-zinc-800 mb-2">
          Easy Booking
        </p>
        <p className="system-ui text-zinc-500 leading-relaxed text-sm">
          Search, compare and book your perfect treatment in minutes.
        </p>
      </div>
    </div>

    <p className="system-ui text-center text-zinc-500 mt-8 text-sm">
      Skip the endless research across Google, Yelp, and social media
    </p>
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
    </div>
  )
}

export default LandingContent