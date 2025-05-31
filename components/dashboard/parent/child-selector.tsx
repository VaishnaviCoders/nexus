'use client';

import { useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { ParentData } from '@/types';
import { AvatarImage } from '@radix-ui/react-avatar';

type Child = ParentData['students'][0]['student'];

interface ChildSelectorProps {
  children: Child[];
  selectedChild: Child;
  onSelectChild: (child: Child) => void;
}

export function ChildSelector({
  children,
  selectedChild,
  onSelectChild,
}: ChildSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedChild.profileImage || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {selectedChild.firstName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span>{selectedChild.firstName}</span>
            <span className="text-xs text-muted-foreground ml-1">
              ({selectedChild.grade.grade}, {selectedChild.section.name})
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search child..." />
          <CommandList>
            <CommandEmpty>No child found.</CommandEmpty>
            <CommandGroup>
              {children.map((child) => (
                <CommandItem
                  key={child.id}
                  value={child.id}
                  onSelect={() => {
                    onSelectChild(child);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {child.firstName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{`${child.firstName} ${child.lastName}`}</span>
                    <span className="text-xs text-muted-foreground ml-1">
                      ({child.grade.grade}, {child.section.name})
                    </span>
                  </div>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedChild.id === child.id
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
