import { cn } from '@/lib/utils';
import { ArrowRightIcon } from 'lucide-react';
import React from 'react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import AnimatedShinyText from '@/components/ui/animated-shiny-text';
import Marquee from '@/components/ui/marquee';

const Testimonials = () => {
  return (
    <>
      <div className="z-10 flex  items-center justify-center">
        <div
          className={cn(
            'group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800'
          )}
        >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Nexus Customers </span>
            <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedShinyText>
        </div>
      </div>
      <div className="relative z-10">
        <h1 className="mt-8 text-2xl font-semibold text-center lg:text-3xl xl:text-4xl">
          What people are saying
        </h1>
        <p className="max-w-lg mx-auto mt-6 text-center text-neutral-500">
          We are very proud of the service we provide and stand by every product
          we carry. Read our testimonials from our happy customers.
        </p>
      </div>

      <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg  bg-background">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </>
  );
};

export default Testimonials;

const reviews = [
  {
    name: 'Ravi Kumar',
    username: '@ravik',
    body: "This school management system has truly transformed how we track student progress. It's efficient and easy to use. Highly recommended!",
    img: 'https://avatar.vercel.sh/ravi',
  },
  {
    name: 'Priya Sharma',
    username: '@priyasharma',
    body: 'We were struggling with attendance and fee management, but this system made everything simple and transparent. Such a relief for our admin team!',
    img: 'https://avatar.vercel.sh/priya',
  },
  {
    name: 'Ajay Patel',
    username: '@ajayp',
    body: 'I am amazed by how smoothly this system integrates everything – from student details to fee structures. It saves us so much time. Great work!',
    img: 'https://avatar.vercel.sh/ajay',
  },
  {
    name: 'Sunita Reddy',
    username: '@sunitar',
    body: 'This software has made communication between parents and teachers much easier. I really appreciate how streamlined it is. Very happy with it.',
    img: 'https://avatar.vercel.sh/sunita',
  },
  {
    name: 'Vikram Singh',
    username: '@vikramsingh',
    body: 'We implemented this system in our school last year, and the results have been fantastic. From tracking grades to managing fees, everything is now paperless and automated!',
    img: 'https://avatar.vercel.sh/vikram',
  },
  {
    name: 'Meera Jain',
    username: '@meeraj',
    body: "This is the best solution we've found for managing everything in one place. The support team is also very responsive. Would recommend it to all schools!",
    img: 'https://avatar.vercel.sh/meera',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    // <figure
    //   className={cn(
    //     'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
    //     // light styles
    //     'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
    //     // dark styles
    //     'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
    //   )}
    // >
    //   <div className="flex flex-row items-center gap-2">
    //     <img className="rounded-full" width="32" height="32" alt="" src={img} />
    //     <div className="flex flex-col">
    //       <figcaption className="text-sm font-medium dark:text-white">
    //         {name}
    //       </figcaption>
    //       <p className="text-xs font-medium dark:text-white/40">{username}</p>
    //     </div>
    //   </div>
    //   <blockquote className="mt-2 text-sm line-clamp-3">{body}</blockquote>

    <Card className="w-96 p-4 cursor-pointer">
      <CardHeader className="p-0 mb-4 ">
        <CardTitle className="flex space-x-2">
          <Image
            className="rounded-full object-cover w-12 h-12"
            width="32"
            height="32"
            alt="testimonial Image "
            src={img}
          />
          <div className="flex flex-col ">
            <p className="text-lg">{name}</p>
            <p className="text-sm">{username}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardDescription className="line-clamp-3">{body}</CardDescription>
    </Card>
    // </figure>
  );
};
