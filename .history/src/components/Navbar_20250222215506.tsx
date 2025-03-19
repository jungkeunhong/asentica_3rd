'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) { // scroll down
          setShow(false);
        } else { // scroll up
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <nav className={`fixed w-full bg-white shadow-md transition-transform duration-300 z-50 ${show ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Asentica</span>
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
