'use client';

import { useState } from 'react';
import { calculateDagaraElement, type ElementData, isValidBirthYear } from '@/lib/dagara';
import Link from 'next/link';

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
    <main className="min-h-screen bg-gradient-to-b from-bg to-cream">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-teal hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-ink mb-4">
            Dagara Numerology Quiz
          </h1>
          <p className="text-xl text-copy max-w-2xl mx-auto">
            Discover your elemental energy and spirit bird guide through the ancient Dagara Base 5 system.
          </p>
        </div>

        {/* Quiz Card */}
        <div className="max-w-2xl mx-auto bg-card rounded-2xl shadow-xl p-8 md:p-12">
          {!element ? (
            /* Input Stage */
            <div className="text-center">
              <div className="mb-8">
                <div className="text-6xl mb-4">🌀</div>
                <h2 className="text-2xl font-bold text-ink mb-2">
                  Enter Your Birth Year
                </h2>
                <p className="text-copy">
                  The universe speaks through numbers. Let&apos;s find your element.
                </p>
              </div>

              <input
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="e.g., 1985"
                disabled={isCalculating}
                className="w-full max-w-xs mx-auto text-center text-3xl font-bold py-4 px-6 rounded-lg border-2 border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20 mb-6"
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              />

              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}

              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="bg-gradient-to-r from-teal to-ocean-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? 'Calculating...' : 'Reveal My Element'}
              </button>

              {isCalculating && (
                <div className="mt-8">
                  <div className="animate-spin w-16 h-16 border-4 border-teal border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-mute mt-4">
                    Spinning the toroidal field...
                  </p>
                </div>
              )}
            </div>
          ) : showEmailGate ? (
            /* Email Gate */
            <div className="text-center">
              <div className="text-6xl mb-6">{element.bird === 'Flicker' ? '🔥' : element.bird === 'Blue Heron' ? '🕊️' : element.bird === 'Egret' ? '🦢' : element.bird === 'Wind Eagle' ? '🦅' : '🐦'}</div>
              
              <h2 className="text-3xl font-bold text-ink mb-3">
                You are <span style={{ color: element.color }}>{element.element}</span>
              </h2>
              
              <p className="text-xl text-copy mb-6">
                {element.description}
              </p>

              <div className="bg-gradient-to-r from-teal/10 to-lavender/10 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-ink mb-2">Your Core Traits:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {element.traits.map((trait) => (
                    <span key={trait} className="bg-white px-4 py-2 rounded-full text-sm font-medium text-copy shadow-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-sunrise-gold/20 border-2 border-sunrise-gold rounded-lg p-6 mb-6">
                <p className="font-bold text-ink mb-2">🔒 Unlock Your Full Reading</p>
                <p className="text-sm text-copy">
                  Enter your email to discover your spirit bird ({element.bird}), detailed strengths, 
                  challenges, and daily balance practices.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-6 py-3 rounded-lg border-2 border-border focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal to-ocean-blue text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Get My Full Reading →
                </button>
              </form>

              <p className="text-xs text-mute mt-4">
                We&apos;ll send you the full reading + occasional wisdom from Scott Sherman. 
                Unsubscribe anytime.
              </p>
            </div>
          ) : (
            /* Full Results */
            <div>
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{element.bird === 'Flicker' ? '🔥' : element.bird === 'Blue Heron' ? '🕊️' : element.bird === 'Egret' ? '🦢' : element.bird === 'Wind Eagle' ? '🦅' : '🐦'}</div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: element.color }}>
                  {element.element} - {element.bird}
                </h2>
                <p className="text-copy italic">{element.traits.join(' • ')}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-ink mb-2">✨ Your Essence</h3>
                  <p className="text-copy">{element.description}</p>
                </div>

                <div>
                  <h3 className="font-bold text-ink mb-2">💪 Your Strengths</h3>
                  <p className="text-copy">{element.strengths}</p>
                </div>

                <div>
                  <h3 className="font-bold text-ink mb-2">🌊 Growth Edges</h3>
                  <p className="text-copy">{element.challenges}</p>
                </div>

                <div className="bg-gradient-to-r from-teal/10 to-lavender/10 rounded-lg p-6">
                  <h3 className="font-bold text-ink mb-2">🧘 Daily Balance Practice</h3>
                  <p className="text-copy">{element.balancePractice}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-copy mb-4">
                  Want to go deeper? Explore Soul Cultivation coaching and courses.
                </p>
                <Link 
                  href="/soul-cultivation"
                  className="inline-block bg-gradient-to-r from-teal to-ocean-blue text-white px-6 py-3 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Explore Soul Cultivation →
                </Link>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setElement(null);
                    setBirthYear('');
                    setShowEmailGate(false);
                    setEmail('');
                  }}
                  className="text-mute hover:text-copy text-sm"
                >
                  Take quiz again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
