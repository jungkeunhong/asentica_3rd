'use client';

import Link from 'next/link';
import { User } from 'lucide-react'; // 트렌디한 아이콘 라이브러리

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
        <div className="font-extrabold flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center">
            <span className="cormorant text-2xl italic text-black">Asentica</span>
          </Link>
          <Link 
            href="/my-page" 
            className="flex items-center gap-2 px-4 py-2 hover:bg-amber-100 text-amber-800 transition-all duration-300"
          >
            <User size={24} className="text-amber-700" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
