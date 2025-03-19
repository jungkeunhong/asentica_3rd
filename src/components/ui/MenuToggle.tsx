'use client';

import { Menu } from 'lucide-react';

interface MenuToggleProps {
  onClick: () => void;
  isOpen: boolean;
}

export function MenuToggle({ onClick, isOpen }: MenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed top-4 left-4 z-50 p-2 rounded-md transition-colors ${
        isOpen 
          ? 'text-white md:text-amber-900' 
          : 'text-amber-900 hover:bg-gray-100'
      } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      <Menu size={24} />
    </button>
  );
} 