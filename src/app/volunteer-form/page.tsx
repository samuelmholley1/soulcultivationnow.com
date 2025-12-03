'use client';

import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';
import VolunteerForm from '@/components/VolunteerForm';

export default function VolunteerFormPage() {
  return (
    <>
      <SiteNavigation />
      
      {/* Main Content */}
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-2)' }}>
        <div className="container">

          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-1)', lineHeight: '1.1', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
              RSVP Volunteer Enrollment
            </h1>
            <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 0, maxWidth: '700px', marginInline: 'auto', lineHeight: '1.4', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
              Thank you for your interest in NCO Volunteer Network&apos;s Retired Senior Volunteer Program. Please complete the form below to enroll.
            </p>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-3)', maxWidth: '700px', marginInline: 'auto' }}>
            <h3 className="text-sm md:text-base font-['Jost',sans-serif] font-bold text-blue-900" style={{ marginBottom: 'var(--space-1)', lineHeight: '1.2' }}>
              🔒 Confidentiality Notice
            </h3>
            <p className="text-xs md:text-sm text-blue-900 font-['Bitter',serif]" style={{ marginBottom: 0, lineHeight: '1.4' }}>
              All information provided is maintained by RSVP as <strong>CONFIDENTIAL</strong>. Your personal information will be used solely for volunteer program administration and insurance purposes.
            </p>
          </div>

          {/* Form Component */}
          <div className="card" style={{ maxWidth: '900px', marginInline: 'auto' }}>
            <VolunteerForm />
          </div>

        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
