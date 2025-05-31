import React from 'react';
import CountdownTimer from './CountdownTimer';
import Image from 'next/image';

const ComingSoon = () => {
  const targetDate = new Date('2025-06-20T00:00:00');
  return (
    <div className="w-full min-h-screen mx-auto flex flex-col items-center gap-8 py-10">
      <div className="space-y-6">
        <p className="text-3xl font-semibold text-primary text-center">
          Seems Like you are a little early
        </p>
      </div>

      <CountdownTimer targetDate={targetDate} className="text-center " />
      <div className="space-y-6 w-full h-full flex justify-center items-center flex-col relative">
        <div className="w-full aspect-[10/4] max-w-7xl relative rounded-3xl overflow-hidden  mb-6 z-10 ">
          <Image
            src={'/images/comingsoon.png'}
            fill
            alt="Empty State"
            className="object-cover"
            property=""
          />
        </div>
        <div className="bg-gradient-to-tl from-purple-100 to-indigo-600  blur-3xl rounded-full absolute -top-52 opacity-50 animate-pulse w-[500px] h-[500px]"></div>
      </div>
    </div>
  );
};

export default ComingSoon;
