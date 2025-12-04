'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';

type PathwayType = 'material' | 'bridge' | 'soul' | null;

export default function HomePage() {
  const [selectedPath, setSelectedPath] = useState<PathwayType>(null);

  const pathways = {
    material: {
      title: 'The Material Path',
      subtitle: 'Social Work • Research • Psychology',
      emoji: '📚',
      color: '#4682B4',
      description: 'Grounded in Master\'s level training, backed by sociology and behavioral science. The academic foundation.',
      fullContent: (
        <div className="font-['Bitter',serif]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', lineHeight: '1.7', color: '#374151' }}>
          <h3 className="font-['Jost',sans-serif] font-bold text-[#4682B4]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-4)' }}>The Material Path: Academic Foundation</h3>
          
          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Master&apos;s Level Social Work:</strong> Scott Sherman brings years of clinical training and practice, understanding how trauma shapes the nervous system and how healing occurs in relationship.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Research-Backed Approaches:</strong> Drawing from sociology, behavioral science, and attachment theory, this path respects the scientific method while acknowledging its limits in capturing the full human experience.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>What You&apos;ll Learn:</strong> Trauma response patterns, nervous system regulation, evidence-based therapeutic techniques, and how to work with the body&apos;s innate wisdom.
          </p>

          <p style={{ marginBottom: 'var(--space-4)' }}>
            This path is ideal for those who value academic rigor and want to understand the "how" and "why" behind healing practices. It provides the intellectual framework that supports deeper transformation.
          </p>

          <button 
            onClick={() => setSelectedPath(null)}
            className="inline-block bg-[#4682B4] text-white font-['Jost',sans-serif] font-medium rounded-lg hover:bg-[#3a6d99] transition-all duration-300"
            style={{ padding: '0.75rem 1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
          >
            ← Back to Fork in Road
          </button>
        </div>
      )
    },
    bridge: {
      title: 'The Bridge',
      subtitle: 'Soul Cultivation • Integration • Flow',
      emoji: '🌊',
      color: '#427d78',
      description: 'Where ancient wisdom meets modern psychology. Move from trauma to flow. Align your Three Brains. This is the integrated path.',
      recommended: true,
      fullContent: (
        <div className="font-['Bitter',serif]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', lineHeight: '1.7', color: '#374151' }}>
          <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-4)' }}>
            The Bridge: Integration & Flow <span className="inline-block bg-[#FFD700] text-[#000] rounded-full text-xs font-bold" style={{ padding: '0.25rem 0.5rem', marginLeft: '0.5rem' }}>RECOMMENDED</span>
          </h3>
          
          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Soul Cultivation:</strong> This is where the magic happens. The Bridge integrates academic rigor with shamanic wisdom, creating a holistic path to flow state living.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>The Three Brains Model:</strong> Learn to align your Head Brain (thoughts), Heart Brain (emotions), and Gut Brain (instincts). When these three centers work in harmony, you enter flow.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>From Trauma to Flow:</strong> Understand how trauma creates dysregulation between your three brains, and learn practical techniques to restore alignment. This is the Trail Guide model—Scott scouts ahead and shows you the path, but you climb the mountain yourself.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>What Makes This Recommended:</strong> Most people need both the academic understanding AND the energetic practices. The Bridge gives you permission to honor both your logical mind and your intuitive wisdom. It&apos;s not either/or—it&apos;s both/and.
          </p>

          <p style={{ marginBottom: 'var(--space-4)' }}>
            This path includes breathwork, somatic practices, Dagara cosmology, and psychology—all woven together. If you&apos;re done with spiritual bypassing AND scientific reductionism, this is your path.
          </p>

          <button 
            onClick={() => setSelectedPath(null)}
            className="inline-block bg-[#427d78] text-white font-['Jost',sans-serif] font-medium rounded-lg hover:bg-[#5eb3a1] transition-all duration-300"
            style={{ padding: '0.75rem 1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
          >
            ← Back to Fork in Road
          </button>
        </div>
      )
    },
    soul: {
      title: 'The Soul Path',
      subtitle: 'Rituals • Energy • Shamanic Practice',
      emoji: '🕊️',
      color: '#967BB6',
      description: 'Blue Heron lineage. Dagara cosmology. Water cleansing, grief rituals, and space clearing. The energetic foundation.',
      fullContent: (
        <div className="font-['Bitter',serif]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)', lineHeight: '1.7', color: '#374151' }}>
          <h3 className="font-['Jost',sans-serif] font-bold text-[#967BB6]" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-4)' }}>The Soul Path: Shamanic Foundation</h3>
          
          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Blue Heron Lineage:</strong> Scott trained in classical shamanic practice, particularly the Water element teachings. Blue Heron medicine is about reconciliation, healing, and emotional cleansing.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Dagara Cosmology:</strong> Working with the Five Elements (Water, Fire, Earth, Mineral, Nature) and their corresponding spirit birds. Each element offers medicine and wisdom for different aspects of healing.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Rituals & Ceremonies:</strong> Water cleansing rituals, grief rituals (sacred space for loss and transformation), space clearing (removing stuck energy from homes and land), and working with ancestors.
          </p>

          <p style={{ marginBottom: 'var(--space-3)' }}>
            <strong>Energy Work:</strong> This path honors the unseen realms—the energy that moves through all things. You&apos;ll learn to sense, work with, and clear energetic patterns that traditional therapy can&apos;t touch.
          </p>

          <p style={{ marginBottom: 'var(--space-4)' }}>
            This path is for those who trust their intuition, who know there&apos;s more to reality than what can be measured. If you&apos;re called to ceremony, to ritual, to the medicine of the natural world—this is your path.
          </p>

          <button 
            onClick={() => setSelectedPath(null)}
            className="inline-block bg-[#967BB6] text-white font-['Jost',sans-serif] font-medium rounded-lg hover:bg-[#7d62a0] transition-all duration-300"
            style={{ padding: '0.75rem 1.5rem', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
          >
            ← Back to Fork in Road
          </button>
        </div>
      )
    }
  };

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
            {!selectedPath ? (
              <>
                <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-center" style={{ marginBottom: 'var(--space-4)', lineHeight: '1.2', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
                  Choose Your Path
                </h2>
                <p className="font-['Bitter',serif] text-[#666] text-center" style={{ marginBottom: 'var(--space-5)', maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
                  Whether you seek academic understanding, spiritual practice, or the integrated approach,
                  your journey to flow begins here.
                </p>

                {/* Three Pathway Cards */}
                <div className="grid-cards" style={{ marginBottom: 'var(--space-5)' }}>
                  {/* Left Path - Material */}
                  <button 
                    onClick={() => setSelectedPath('material')}
                    className="card group hover:border-[#4682B4] hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
                  >
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
                  </button>

                  {/* Middle Path - Bridge (RECOMMENDED) */}
                  <button 
                    onClick={() => setSelectedPath('bridge')}
                    className="card relative border-4 border-[#427d78] bg-gradient-to-br from-[#427d78] to-[#967BB6] hover:shadow-xl transition-all duration-300 text-left cursor-pointer"
                    style={{ minHeight: '100%' }}
                  >
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
                  </button>

                  {/* Right Path - Soul */}
                  <button 
                    onClick={() => setSelectedPath('soul')}
                    className="card group hover:border-[#967BB6] hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
                  >
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
                  </button>
                </div>
              </>
            ) : (
              <div className="card" style={{ padding: 'var(--space-5)', maxWidth: '900px', marginInline: 'auto' }}>
                {pathways[selectedPath].fullContent}
              </div>
            )}
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
