import { Suspense } from 'react';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityFeedSkeleton from '@/components/community/CommunityFeedSkeleton';
import { MainLayout } from '@/components/layouts/MainLayout';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Community - Asentica',
  description: 'Join the Asentica skincare community to share experiences and get advice',
};

export default function CommunityPage() {
  return (
    <MainLayout>
      <Navbar />
      <div className="container mx-auto px-4 py-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community</h1>
        <Suspense fallback={<CommunityFeedSkeleton />}>
          <CommunityFeed />
        </Suspense>
      </div>
    </MainLayout>
  );
} 