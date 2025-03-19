import { FeedType } from '@/types/community';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  feedType: FeedType;
}

export default function EmptyState({ feedType }: EmptyStateProps) {
  const messages = {
    trending: {
      title: 'No trending posts yet',
      description: 'Be the first to create a popular post in the community!'
    },
    latest: {
      title: 'No recent posts',
      description: 'Start a conversation by creating the first post.'
    },
    'for-you': {
      title: 'No personalized posts',
      description: 'We\'ll show posts here based on your interests and activity.'
    }
  };

  const { title, description } = messages[feedType];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-amber-50 p-4 rounded-full mb-4">
        <FileQuestion size={40} className="text-amber-900" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      <Button className="bg-amber-900 hover:bg-amber-800 text-white">
        Create a Post
      </Button>
    </div>
  );
} 