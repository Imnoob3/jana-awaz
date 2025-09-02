'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export function ExpandableText({ text, maxLength = 100 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  return (
    <div className="space-y-2">
      <span>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </span>
      <div>
        <Button 
          variant="link" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </Button>
      </div>
    </div>
  );
}
