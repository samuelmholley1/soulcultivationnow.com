'use client';

import Link from 'next/link';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';

export default function HomePage() {
  return (
    <>
      <SiteNavigation />
      
      {/* Hero Section */}
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-6)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-3)', lineHeight: '1.1', fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}>
              Soul Cultivation
            </h1>
            <p className="font-['Jost',serif] text-[#967BB6] font-medium" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.3' }}>
              We can&apos;t not become enlightened;<br />it is our destiny path.
            </p>
            <p className="font-['Bitter',serif] text-[#666]" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: '1.5' }}>
              We might as well embrace it.
            </p>
          </div>

          {/* The Fork - Three Pathways */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-center" style={{ marginBottom: 'var(--space-4)', lineHeight: '1.2', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
              Choose Your Path
            </h2>
            <p className="font-['Bitter',serif] text-[#666] text-center" style={{ marginBottom: 'var(--space-5)', maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              Whether you seek academic understanding, spiritual practice, or the integrated approach,
              your journey to flow begins here.
            </p>

            {/* Three Pathway Cards */}
            <div className="grid-cards" style={{ marginBottom: 'var(--space-5)' }}>
              {/* Left Path - Professional */}
              <Link href="/professional" className="card group hover:border-[#4682B4] transition-all duration-300">
                <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📚</div>
                  <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] group-hover:text-[#4682B4]" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.2' }}>
                    The Material Path
                  </h3>
                  <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', lineHeight: '1.4' }}>
                    Social Work • Research • Psychology
                  </p>
                  <p className="font-['Bitter',serif] text-[#6B7280]" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', lineHeight: '1.5' }}>
                    Grounded in Master&apos;s level training, backed by sociology and behavioral science. The academic foundation.
                  </p>
                </div>
              </Link>

              {/* Middle Path - Integrated (RECOMMENDED) */}
              <Link href="/soul-cultivation" className="card relative border-4 border-[#427d78] bg-gradient-to-br from-[#427d78] to-[#967BB6] hover:shadow-xl transition-all duration-300" style={{ minHeight: '100%' }}>
                <div className="absolute -top-3 -right-3 bg-[#FFD700] text-[#000] font-['Jost',sans-serif] font-bold rounded-full shadow-md" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                  RECOMMENDED
                </div>
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'white' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🌊</div>
                  <h3 className="font-['Jost',sans-serif] font-bold" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.2' }}>
                    The Bridge
                  </h3>
                  <p className="font-['Bitter',serif] font-medium" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', lineHeight: '1.4' }}>
                    Soul Cultivation • Integration • Flow
                  </p>
                  <p className="font-['Bitter',serif]" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', lineHeight: '1.5', opacity: 0.95 }}>
                    Where ancient wisdom meets modern psychology. Move from trauma to flow. Align your Three Brains. This is the integrated path.
                  </p>
                </div>
              </Link>

              {/* Right Path - Shamanic */}
              <Link href="/shamanic" className="card group hover:border-[#967BB6] transition-all duration-300">
                <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🕊️</div>
                  <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] group-hover:text-[#967BB6]" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: '1.2' }}>
                    The Soul Path
                  </h3>
                  <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(0.875rem, 2vw, 1rem)', lineHeight: '1.4' }}>
                    Rituals • Energy • Shamanic Practice
                  </p>
                  <p className="font-['Bitter',serif] text-[#6B7280]" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)', lineHeight: '1.5' }}>
                    Blue Heron lineage. Dagara cosmology. Water cleansing, grief rituals, and space clearing. The energetic foundation.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Quiz CTA */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #427d78 0%, #4682B4 100%)', border: 'none', color: 'white', textAlign: 'center', padding: 'var(--space-6)' }}>
            <h2 className="font-['Jost',sans-serif] font-bold" style={{ marginBottom: 'var(--space-3)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '1.2' }}>
              Discover Your Elemental Path
            </h2>
            <p className="font-['Bitter',serif]" style={{ marginBottom: 'var(--space-4)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: '1.5', opacity: 0.95 }}>
              Take the Dagara Numerology Quiz to reveal your spirit bird and elemental energy.
            </p>
            <Link 
              href="/quiz"
              className="inline-block bg-white text-[#427d78] font-['Jost',sans-serif] font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{ padding: '1rem 2rem', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
            >
              Take the Quiz →
            </Link>
          </div>

          {/* About Preview */}
          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', paddingBlock: 'var(--space-4)' }}>
            <p className="font-['Bitter',serif] text-[#666]" style={{ maxWidth: '900px', marginInline: 'auto', lineHeight: '1.7', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              <strong className="text-[#427d78]">Scott Sherman</strong> — The Mendocino Alchemist. 
              A Master&apos;s level Social Worker and classically trained Shaman (Blue Heron lineage) 
              who bridges ancient wisdom with modern psychology. Like the Flicker bird, 
              he flies ahead to scout the terrain, showing you the path without carrying you up the mountain.
            </p>
            <Link 
              href="/about" 
              className="inline-block font-['Jost',sans-serif] font-medium text-[#427d78] hover:text-[#5eb3a1] transition-colors"
              style={{ marginTop: 'var(--space-3)', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}
            >
              Meet Scott →
            </Link>
          </div>
        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
