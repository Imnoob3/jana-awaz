'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ImagePreviewProps {
  imageUrl: string;
  alt?: string;
}

export function ImagePreview({ imageUrl, alt = 'Report Image' }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-fit">
        <div className="relative w-full max-h-[80vh] aspect-auto">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={600}
            className="object-contain rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
