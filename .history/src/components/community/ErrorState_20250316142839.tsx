import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertTriangle size={40} className="text-red-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message || 'We encountered an error while loading posts. Please try again.'}</p>
      <Button 
        onClick={handleRetry}
        className="bg-amber-900 hover:bg-amber-800 text-white"
      >
        Try Again
      </Button>
    </div>
  );
} 