'use client';

import { useState } from 'react';
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
import { Copy, Check, Facebook, Twitter, Instagram, Video } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-white',
      hoverColor: 'hover:bg-gray-100',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`
    },
    {
      name: 'X',
      icon: Twitter,
      color: 'bg-white',
      hoverColor: 'hover:bg-gray-100',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-white',
      hoverColor: 'hover:bg-gray-100',
      url: `https://www.instagram.com/?url=${encodeURIComponent(url)}`
    },
    {
      name: 'TikTok',
      icon: Video,
      color: 'bg-white',
      hoverColor: 'hover:bg-gray-100',
      url: `https://www.tiktok.com/share?url=${encodeURIComponent(url)}`
    }
  ];
  
  const handleShareClick = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
          <DialogDescription>
            Share this post with your friends and followers
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Input
              value={url}
              readOnly
              className="flex-1"
              aria-label="Share URL"
            />
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={handleCopyLink}
              className="px-3"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy link</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mt-2">
            {shareOptions.map((option) => (
              <motion.button
                key={option.name}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShareClick(option.url)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg ${option.color} ${option.hoverColor} transition-colors border border-gray-200`}
                aria-label={`Share on ${option.name}`}
              >
                <option.icon className="h-5 w-5 mb-1 text-black" />
                <span className="text-xs text-black">{option.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 