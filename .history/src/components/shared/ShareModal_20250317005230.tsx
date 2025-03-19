'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Reset copied state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
    }
  }, [isOpen]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareByEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this post: ${url}`)}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">Share this post</DialogTitle>
          <DialogDescription>
            Share this post with your friends and colleagues
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={url}
            readOnly
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleCopyToClipboard}
            className={copied ? "text-green-600" : ""}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Share on social media</h4>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={shareToFacebook}
              className="rounded-full hover:text-blue-600 hover:border-blue-600"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={shareToTwitter}
              className="rounded-full hover:text-blue-400 hover:border-blue-400"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={shareToLinkedIn}
              className="rounded-full hover:text-blue-700 hover:border-blue-700"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={shareByEmail}
              className="rounded-full hover:text-amber-900 hover:border-amber-900"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 