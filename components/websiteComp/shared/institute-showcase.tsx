'use client';
import { motion } from 'framer-motion';
import InstituteAvatarPopover from './Institute-avatar-popover';
import { institutes } from '@/constants';
import { Globe } from '@/components/ui/globe';

// i have new idea can we do this as grid and columns and rows
// first Row : 1 , 2 ,3 ,4 ,5 ,6 ,6 ,7 .... 16 for desktop , 15 for tab , 8 for mobile
// Second Row :then last index 16 length for desktop , 15 for tab , 8 for mobile
// 3rd Row :then last index 10 length for desktop (5left - 5right ), 15 for tab , 8 for mobile
// 4th Row :then last index 16 length for desktop (4left - 5right ),  , 15 for tab(3-3) , 8 for mobile(2-2)
// 5th Row :then last index 16 length for desktop (2left - 2right ), , 15 for tab , 8 for mobile((1left - 1right ),)

// tailwind css and shad-cn
const InstitutesShowcase = () => {
  return (
    <div className="text-center py-4 px-4 relative overflow-hidden">
      {/* Responsive Globe */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full z-50">
        <Globe className="top-26 z-50 absolute" />
      </div>

      {/* Tablet & Desktop Layout */}
      <div className="lg:grid grid-cols-7 max-w-7xl mx-auto">
        {/* Row 1 */}
        <div className="col-span-7 flex justify-between ">
          {institutes.slice(0, 22).map((institute) => (
            <motion.div
              key={institute.id}
              className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
            >
              <InstituteAvatarPopover institute={institute} />
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="col-span-7 flex justify-between ">
          {institutes.slice(23, 40).map((institute) => (
            <motion.div
              key={institute.id}
              className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
            >
              <InstituteAvatarPopover institute={institute} />
            </motion.div>
          ))}
        </div>

        {/* Row 3 */}
        <div className="col-span-7 flex justify-items-end">
          {institutes.slice(41, 64).map((institute) => (
            <motion.div
              key={institute.id}
              className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
            >
              <InstituteAvatarPopover institute={institute} />
            </motion.div>
          ))}
        </div>

        {/* Row 4 */}
        <div className="col-span-7 flex justify-between">
          {institutes.slice(65, 83).map((institute) => (
            <motion.div
              key={institute.id}
              className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
            >
              <InstituteAvatarPopover institute={institute} />
            </motion.div>
          ))}
        </div>

        {/* Row 5 */}
        <div className="col-span-7 flex justify-between">
          {institutes.slice(84, 101).map((institute) => (
            <motion.div
              key={institute.id}
              className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
            >
              <InstituteAvatarPopover institute={institute} />
            </motion.div>
          ))}
        </div>

        {/* Row 6 */}
        <div className="col-span-7 flex justify-between">
          <div className="flex justify-between w-full">
            <div className="flex">
              {institutes.slice(101, 108).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
            <div className="flex">
              {institutes.slice(109, 116).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 7 */}
        <div className="col-span-7 flex justify-between">
          <div className="flex justify-between w-full">
            <div className="flex">
              {institutes.slice(50, 55).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
            <div className="flex">
              {institutes.slice(55, 60).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 8 */}
        <div className="col-span-7 flex justify-between">
          <div className="flex justify-between w-full">
            <div className="flex">
              {institutes.slice(50, 54).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
            <div className="flex">
              {institutes.slice(55, 60).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 9 */}
        <div className="col-span-7 flex justify-between">
          <div className="flex justify-between w-full">
            <div className="flex">
              {institutes.slice(50, 52).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
            <div className="flex">
              {institutes.slice(58, 61).map((institute) => (
                <motion.div
                  key={institute.id}
                  className="w-16 h-16 flex transition-opacity duration-300 ease-in-out"
                >
                  <InstituteAvatarPopover institute={institute} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutesShowcase;
