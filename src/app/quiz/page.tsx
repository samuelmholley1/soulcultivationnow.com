'use client';

import { useState } from 'react';
import { calculateDagaraElement, type ElementData, isValidBirthYear } from '@/lib/dagara';
import Link from 'next/link';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';

export default function QuizPage() {
  const [birthYear, setBirthYear] = useState('');
  const [element, setElement] = useState<ElementData | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const year = parseInt(birthYear, 10);
    
    if (!birthYear || isNaN(year)) {
      setError('Please enter your birth year');
      return;
    }
    
    if (!isValidBirthYear(year)) {
      setError('Please enter a valid birth year between 1900 and now');
      return;
    }
    
    setError('');
    setIsCalculating(true);
    
    // Simulate toroidal animation delay
    setTimeout(() => {
      const result = calculateDagaraElement(year);
      setElement(result);
      setIsCalculating(false);
      setShowEmailGate(true);
    }, 2000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // TODO: Send to Airtable
    console.log('Submitting to Airtable:', { email, element: element?.element, birthYear });
    
    setShowEmailGate(false);
  };

  return (
    <>
      <SiteNavigation />
      
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-6)' }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-3)', lineHeight: '1.1', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
              Dagara Numerology Quiz
            </h1>
            <p className="font-['Bitter',serif] text-[#666]" style={{ maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              Discover your elemental energy and spirit bird guide through the ancient Dagara Base 5 system.
            </p>
          </div>

          {/* Quiz Card */}
          <div className="card" style={{ maxWidth: '800px', marginInline: 'auto' }}>
            {!element ? (
              /* Input Stage */
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>🌀</div>
                  <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                    Enter Your Birth Year
                  </h2>
                  <p className="font-['Bitter',serif] text-[#666]" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    The universe speaks through numbers. Let&apos;s find your element.
                  </p>
                </div>

                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="e.g., 1985"
                  disabled={isCalculating}
                  className="font-['Jost',sans-serif] font-bold"
                  style={{ 
                    width: '100%', 
                    maxWidth: '300px', 
                    textAlign: 'center', 
                    fontSize: '2rem', 
                    padding: 'var(--space-3)', 
                    borderRadius: 'var(--radius)', 
                    border: '2px solid var(--border)',
                    marginBottom: 'var(--space-4)'
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                />

                {error && (
                  <p className="font-['Bitter',serif]" style={{ color: '#EF4444', marginBottom: 'var(--space-3)', fontSize: '0.875rem' }}>{error}</p>
                )}

                <button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="font-['Jost',sans-serif] font-bold bg-gradient-to-r from-[#427d78] to-[#4682B4] text-white rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}
                >
                  {isCalculating ? 'Calculating...' : 'Reveal My Element'}
                </button>

                {isCalculating && (
                  <div style={{ marginTop: 'var(--space-4)' }}>
                    <div className="animate-spin" style={{ width: '4rem', height: '4rem', border: '4px solid var(--teal)', borderTopColor: 'transparent', borderRadius: '50%', marginInline: 'auto' }}></div>
                    <p className="font-['Bitter',serif] text-[#6B7280]" style={{ marginTop: 'var(--space-3)' }}>
                      Spinning the toroidal field...
                    </p>
                  </div>
                )}
              </div>
            ) : showEmailGate ? (
              /* Email Gate */
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>
                  {element.bird === 'Flicker' ? '🔥' : element.bird === 'Blue Heron' ? '🕊️' : element.bird === 'Egret' ? '🦢' : element.bird === 'Wind Eagle' ? '🦅' : '🐦'}
                </div>
                
                <h2 className="font-['Jost',sans-serif] font-bold" style={{ marginBottom: 'var(--space-3)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: element.color }}>
                  You are {element.element}
                </h2>
                
                <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 'var(--space-4)', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: '1.5' }}>
                  {element.description}
                </p>

                <div className="bg-gradient-to-r from-[#427d78]/10 to-[#967BB6]/10 rounded-lg" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)' }}>Your Core Traits:</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {element.traits.map((trait) => (
                      <span key={trait} className="bg-white font-['Bitter',serif] text-[#666] rounded-full shadow-sm" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#FFD700]/20 border-2 border-[#FFD700] rounded-lg" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <p className="font-['Jost',sans-serif] font-bold text-[#000]" style={{ marginBottom: 'var(--space-2)' }}>🔒 Unlock Your Full Reading</p>
                  <p className="font-['Bitter',serif] text-[#000]" style={{ fontSize: '0.875rem' }}>
                    Enter your email to discover your spirit bird ({element.bird}), detailed strengths, 
                    challenges, and daily balance practices.
                  </p>
                </div>

                <form onSubmit={handleEmailSubmit} style={{ marginBottom: 'var(--space-3)' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="font-['Bitter',serif]"
                    style={{ 
                      width: '100%', 
                      padding: 'var(--space-3)', 
                      borderRadius: 'var(--radius)', 
                      border: '2px solid var(--border)',
                      marginBottom: 'var(--space-3)',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="submit"
                    className="font-['Jost',sans-serif] font-bold bg-gradient-to-r from-[#427d78] to-[#4682B4] text-white rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ width: '100%', padding: '1rem 2rem', fontSize: '1.125rem' }}
                  >
                    Get My Full Reading →
                  </button>
                </form>

                <p className="font-['Bitter',serif] text-[#6B7280]" style={{ fontSize: '0.75rem' }}>
                  We&apos;ll send you the full reading + occasional wisdom from Scott Sherman. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              /* Full Results */
              <div style={{ padding: 'var(--space-4)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 'var(--space-3)' }}>
                    {element.bird === 'Flicker' ? '🔥' : element.bird === 'Blue Heron' ? '🕊️' : element.bird === 'Egret' ? '🦢' : element.bird === 'Wind Eagle' ? '🦅' : '🐦'}
                  </div>
                  <h2 className="font-['Jost',sans-serif] font-bold" style={{ marginBottom: 'var(--space-2)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: element.color }}>
                    {element.element} - {element.bird}
                  </h2>
                  <p className="font-['Bitter',serif] text-[#666] italic">{element.traits.join(' • ')}</p>
                </div>

                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <div>
                    <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)' }}>✨ Your Essence</h3>
                    <p className="font-['Bitter',serif] text-[#666]">{element.description}</p>
                  </div>

                  <div>
                    <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)' }}>💪 Your Strengths</h3>
                    <p className="font-['Bitter',serif] text-[#666]">{element.strengths}</p>
                  </div>

                  <div>
                    <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)' }}>🌊 Growth Edges</h3>
                    <p className="font-['Bitter',serif] text-[#666]">{element.challenges}</p>
                  </div>

                  <div className="bg-gradient-to-r from-[#427d78]/10 to-[#967BB6]/10 rounded-lg" style={{ padding: 'var(--space-4)' }}>
                    <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-2)' }}>🧘 Daily Balance Practice</h3>
                    <p className="font-['Bitter',serif] text-[#666]">{element.balancePractice}</p>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                  <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 'var(--space-3)' }}>
                    Want to go deeper? Explore Soul Cultivation coaching and courses.
                  </p>
                  <Link 
                    href="/soul-cultivation"
                    className="inline-block font-['Jost',sans-serif] font-bold bg-gradient-to-r from-[#427d78] to-[#4682B4] text-white rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ padding: '0.75rem 1.5rem' }}
                  >
                    Explore Soul Cultivation →
                  </Link>
                </div>

                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                  <button
                    onClick={() => {
                      setElement(null);
                      setBirthYear('');
                      setShowEmailGate(false);
                      setEmail('');
                    }}
                    className="font-['Bitter',serif] text-[#6B7280] hover:text-[#666] transition-colors"
                    style={{ fontSize: '0.875rem' }}
                  >
                    Take quiz again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
