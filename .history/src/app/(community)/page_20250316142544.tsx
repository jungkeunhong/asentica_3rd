import { Suspense } from 'react';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityFeedSkeleton from '@/components/community/CommunityFeedSkeleton';

export const metadata = {
  title: 'Community - Asentica',
  description: 'Join the Asentica skincare community to share experiences and get advice',
};

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<CommunityFeedSkeleton />}>
        <CommunityFeed />
      </Suspense>
    </div>
  );
} 