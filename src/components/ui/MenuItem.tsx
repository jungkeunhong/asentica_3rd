'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MenuItemProps {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

export function MenuItem({ href, icon, children, onClick }: MenuItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? 'bg-amber-100 text-amber-900 font-medium' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {icon && <span className="text-amber-900">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
} 