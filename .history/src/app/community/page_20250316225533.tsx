'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
    router.refresh();
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
    </div>
  );
} 