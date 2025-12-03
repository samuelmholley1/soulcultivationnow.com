'use client';

import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';
import InternalMembershipForm from '@/components/InternalMembershipForm';

export default function InternalMembershipPage() {
  return (
    <>
      <SiteNavigation />
      
      {/* Main Content */}
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-4)' }}>
        <div className="container">

          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)', lineHeight: '1.2', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
              Internal Membership Entry
            </h1>
            <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 0, maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              For staff use only: Enter membership applications received via paper form with cash or check payment.
            </p>
          </div>

          {/* Staff Notice */}
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)', maxWidth: '800px', marginInline: 'auto' }}>
            <h3 className="text-base md:text-lg font-['Jost',sans-serif] font-bold text-blue-900" style={{ marginBottom: 'var(--space-2)', lineHeight: '1.3' }}>
              📋 Staff Instructions
            </h3>
            <ul className="text-sm md:text-base text-blue-900 font-['Bitter',serif]" style={{ marginBottom: 0, paddingLeft: '1.5rem', lineHeight: '1.6', listStyle: 'disc' }}>
              <li>Enter information exactly as shown on the paper application</li>
              <li>Select the payment method and enter check number if applicable</li>
              <li>Your name will be automatically recorded as the staff member who entered this data</li>
              <li>Review all information before submitting</li>
            </ul>
          </div>

          {/* Form Component */}
          <div className="card" style={{ maxWidth: '900px', marginInline: 'auto' }}>
            <InternalMembershipForm />
          </div>

        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
