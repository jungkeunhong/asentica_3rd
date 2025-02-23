'use client';

import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Category {params.id}</h1>
      <p className="text-gray-600">Coming soon...</p>
    </div>
  );
}
