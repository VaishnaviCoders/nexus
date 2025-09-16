import PrincipalConvincer from '@/components/websiteComp/principal-convincer';
import { SecurityTrust } from '@/components/websiteComp/security-trust';
import React from 'react';

const page = () => {
  return (
    <div>
      <PrincipalConvincer />

      <SecurityTrust />
      {/* <PrincipalBenefits /> */}
      <div className="mt-16 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to Transform Your School Management?
        </h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join hundreds of principals who've already made the switch to modern,
          efficient school management.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule Free Demo
          </button>
          <button className="border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
