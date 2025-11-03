'use client';
import { Suspense, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface Institute {
  id: number;
  name: string;
  image: string;
  paragraph: string;
}

type InstituteProps = {
  institute: Institute;
};

async function getImages() {
  const response = await fetch(
    'https://api.pexels.com/v1/search?query=profile%20portrait&per_page=70',
    {
      headers: {
        Authorization:
          'C54NjaHSt6R7UE4AMWoFPOYEBR5yh3I4TtFuEWfK7TW5ybthj0odMnsk',
      },
      next: { revalidate: 60 * 60 },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch Pexels images');
  const data = await response.json();
  return data.photos || [];
}

const InstituteAvatarPopover = ({ institute }: InstituteProps) => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      try {
        const photos = await getImages();
        const urls = photos.map((photo: any) => photo.src.medium);
        setImages(urls);
      } catch (error) {
        console.error('Error fetching Pexels images:', error);
      }
    }

    fetchImages();
  }, []);

  const imageUrl =
    images[Math.floor(Math.random() * images.length)] || institute.image;

  return (
    <>
      <Suspense
        fallback={
          <Avatar className="h-10 w-10 cursor-pointer rounded-lg  hover:grayscale-0 transition-all duration-300">
            <AvatarImage
              src={'../../../public/images/User.svg'}
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
        }
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="h-10 w-10 cursor-pointer rounded-lg  hover:grayscale-0 transition-all duration-300">
              <AvatarImage
                src={imageUrl || '/placeholder.svg'}
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
          <HoverCardContent className="w-80 rounded-xl ">
            <div className="flex gap-4 z-50">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={imageUrl || '/placeholder.svg'}
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
                <h4 className="text-sm font-semibold truncate ">
                  {institute.name}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {institute.paragraph}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Suspense>
    </>
  );
};

export default InstituteAvatarPopover;
