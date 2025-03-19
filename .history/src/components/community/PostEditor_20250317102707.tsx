'use client';

import { useState, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Image, Link, Code } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
  isPreviewMode: boolean;
}

export default function PostEditor({ content, onChange, isPreviewMode }: PostEditorProps) {
  const [editorContent, setEditorContent] = useState(content || '');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  // Update local state when content prop changes
  useEffect(() => {
    setEditorContent(content || '');
  }, [content]);

  // Update parent component when local content changes
  useEffect(() => {
    onChange(editorContent);
  }, [editorContent, onChange]);

  // Update active tab based on preview mode
  useEffect(() => {
    setActiveTab(isPreviewMode ? 'preview' : 'write');
  }, [isPreviewMode]);

  // Handle text selection in textarea
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  // Insert markdown formatting
  const insertFormatting = (prefix: string, suffix: string = '') => {
    if (!textareaRef) return;

    const start = selectionStart;
    const end = selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const beforeText = editorContent.substring(0, start);
    const afterText = editorContent.substring(end);

    const newText = beforeText + prefix + selectedText + suffix + afterText;
    setEditorContent(newText);

    // Focus and set cursor position after formatting
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
        textareaRef.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // Format handlers
  const handleBold = () => insertFormatting('**', '**');
  const handleItalic = () => insertFormatting('*', '*');
  const handleBulletList = () => insertFormatting('\n- ');
  const handleNumberedList = () => insertFormatting('\n1. ');
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const text = selectionStart !== selectionEnd 
        ? editorContent.substring(selectionStart, selectionEnd) 
        : 'link text';
      insertFormatting('[' + text + '](', url + ')');
    }
  };
  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter image description:') || '';
      insertFormatting('![' + alt + '](', url + ')');
    }
  };
  const handleCode = () => insertFormatting('`', '`');

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    if (!text) return '';
    
    // This is a very basic markdown parser for demo purposes
    // In a real app, you would use a proper markdown library
    let html = text
      // Convert headers
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Convert images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-md my-2" />')
      // Convert code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Convert bullet lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/<\/li>\n<li>/g, '</li><li>')
      .replace(/<li>(.+?)(?=<\/li>|$)/g, function(match) {
        return match.replace(/\n/g, '<br>');
      })
      // Convert numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Convert paragraphs
      .replace(/\n\n/g, '</p><p>')
      // Convert line breaks
      .replace(/\n/g, '<br>');
    
    // Wrap in paragraph tags if not already
    if (!html.startsWith('<h') && !html.startsWith('<p>')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  };

  return (
    <div className="border rounded-md">
      {/* Editor Toolbar */}
      <div className="border-b p-2 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBold}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleItalic}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBulletList}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNumberedList}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLink}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <Link className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleImage}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCode}
            disabled={isPreviewMode}
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}
          className="hidden md:block"
        >
          <TabsList>
            <TabsTrigger value="write" disabled={isPreviewMode}>Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Editor Content */}
      <div className="p-4">
        {activeTab === 'write' && !isPreviewMode ? (
          <Textarea
            ref={(ref) => setTextareaRef(ref)}
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            onSelect={handleSelect}
            placeholder="Write your post content here... Use markdown formatting for rich text."
            className="min-h-[300px] w-full resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        ) : (
          <div 
            className={cn(
              "min-h-[300px] w-full prose prose-sm max-w-none",
              "prose-headings:font-bold prose-headings:text-gray-900",
              "prose-p:text-gray-700 prose-li:text-gray-700",
              "prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline",
              "prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md"
            )}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(editorContent) }}
          />
        )}
      </div>
    </div>
  );
} 