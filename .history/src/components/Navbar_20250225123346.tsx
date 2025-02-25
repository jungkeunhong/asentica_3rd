'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="font-bold flex justify-between h-12 items-center">
          <Link href="/" className="flex items-center">
            <span className="cormorant text-xl italic text-black">Asentica</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}