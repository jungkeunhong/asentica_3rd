'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="font-extrabold flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="cormorant text-2xl italic text-black">Asentica</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}