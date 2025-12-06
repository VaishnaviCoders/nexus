'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

export interface Institute {
  id: number;
  name: string;
  image: string;
  paragraph: string;
}

type InstituteProps = {
  institute: Institute;
};

const InstituteAvatarPopover = ({ institute }: InstituteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);

  const handleClick = () => {
    setIsManualOpen(true);
    setIsOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    // If it was manually opened, don't close immediately
    if (isManualOpen && !open) {
      setIsManualOpen(false);
      // Add a small delay before closing to prevent instant close
      setTimeout(() => setIsOpen(false), 100);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <HoverCard open={isOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild>
        <Avatar
          className="h-10 w-10 cursor-pointer rounded-lg hover:grayscale-0 transition-all duration-300"
          onClick={handleClick}
          onTouchStart={() => setIsOpen(true)}
        >
          <AvatarImage
            src={institute.image || '/placeholder.svg'}
            alt={institute.name}
            className="rounded-lg object-cover"
          />
          <AvatarFallback className="rounded-lg bg-gray-200 text-gray-900">
            {institute.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 rounded-xl"
        onPointerDownOutside={(e) => {
          // Prevent immediate close on mobile
          e.preventDefault();
        }}
      >
        <div className="flex gap-4 z-50">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={institute.image || '/placeholder.svg'}
              alt={institute.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-900">
              {institute.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1 min-w-0 text-start">
            <h4 className="text-sm font-semibold truncate">{institute.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-3">
              {institute.paragraph}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InstituteAvatarPopover;
