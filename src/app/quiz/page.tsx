'use client';

import { useState, useEffect } from 'react';
import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';
import { MedicineWheel } from '@/components/MedicineWheel';
import { InfluenceTable } from '@/components/InfluenceTable';
import { 
  calculateDigitFrequency, 
  mapToMedicineWheel, 
  getDominantElement,
  getEnergyBalance,
  type WheelData 
} from '@/lib/medicineWheel';

export default function QuizPage() {
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [digitCounts, setDigitCounts] = useState<number[]>(new Array(10).fill(0));
  const [wheelData, setWheelData] = useState<WheelData>({
    water: 0,
    nature: 0,
    fire: 0,
    mineral: 0,
    earth: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Real-time calculation as user types
  useEffect(() => {
    if (fullName || birthDate) {
      const counts = calculateDigitFrequency(fullName, birthDate);
      const wheel = mapToMedicineWheel(counts);
      
      setDigitCounts(counts);
      setWheelData(wheel);
      setShowResults(fullName.trim().length > 0 && birthDate.trim().length > 0);
    } else {
      setShowResults(false);
    }
  }, [fullName, birthDate]);

  const handleSubmit = async () => {
    if (!email || !firstName || !lastName || !fullName || !birthDate) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/medicine-wheel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          fullName,
          birthDate,
          waterCount: wheelData.water,
          natureCount: wheelData.nature,
          fireCount: wheelData.fire,
          mineralCount: wheelData.mineral,
          earthCount: wheelData.earth,
          dominantElement: dominantElement.element,
          spiritBird: elementDescriptions[dominantElement.element]?.bird || '',
          masculineEnergy: energyBalance.masculine,
          feminineEnergy: energyBalance.feminine,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('There was an error saving your results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dominantElement = getDominantElement(wheelData);
  const energyBalance = getEnergyBalance(digitCounts);
  const totalDigits = digitCounts.reduce((sum, count) => sum + count, 0);

  // Element descriptions
  const elementDescriptions: Record<string, { bird: string; description: string; color: string }> = {
    Water: {
      bird: 'Blue Heron',
      description: 'Reconciliation, healing, emotional cleansing. You carry the medicine of forgiveness and flow. Your path is to help others release what no longer serves them.',
      color: '#4299E1'
    },
    Nature: {
      bird: 'Flicker (Woodpecker)',
      description: 'Growth, change, and the magic of the natural world. You are the scout who flies ahead, showing others the path. Your medicine is transformation and renewal.',
      color: '#48BB78'
    },
    Fire: {
      bird: 'Red-Tailed Hawk',
      description: 'Vision, passion, and ancestral connection. You see what others cannot, bridging the present and the past. Your medicine is truth-telling and clarity.',
      color: '#F56565'
    },
    Mineral: {
      bird: 'Raven',
      description: 'Memory, structure, and deep wisdom. You carry the stories and knowledge that ground communities. Your medicine is remembrance and foundation.',
      color: '#A0AEC0'
    },
    Earth: {
      bird: 'Owl',
      description: 'Home, nurturing, and grounded wisdom. You create sacred space where others can heal. Your medicine is sanctuary and deep listening.',
      color: '#D69E2E'
    }
  };

  return (
    <>
      <SiteNavigation />
      
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-6)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-3)', lineHeight: '1.1', fontSize: 'clamp(2rem, 6vw, 3rem)' }}>
              Dagara Medicine Wheel
            </h1>
            <p className="font-['Bitter',serif] text-[#666]" style={{ maxWidth: '800px', marginInline: 'auto', lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)' }}>
              Discover your elemental energies and spirit bird guide through ancient Dagara numerology.
              Enter your information and watch your medicine wheel come alive.
            </p>
          </div>

          {/* Input Form Card */}
          <div className="card" style={{ maxWidth: '800px', marginInline: 'auto', marginBottom: 'var(--space-5)' }}>
            <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-4)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
              Your Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Input */}
              <div className="md:col-span-2">
                <label 
                  htmlFor="email" 
                  className="font-['Jost',sans-serif] font-medium text-[#374151] block mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="font-['Bitter',serif] w-full p-3 rounded-lg border-2 border-[#E2E8F0] focus:border-[#427d78] focus:outline-none transition-colors"
                  style={{ fontSize: '1rem' }}
                />
              </div>

              {/* First Name Input */}
              <div>
                <label 
                  htmlFor="firstName" 
                  className="font-['Jost',sans-serif] font-medium text-[#374151] block mb-2"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="font-['Bitter',serif] w-full p-3 rounded-lg border-2 border-[#E2E8F0] focus:border-[#427d78] focus:outline-none transition-colors"
                  style={{ fontSize: '1rem' }}
                />
              </div>

              {/* Last Name Input */}
              <div>
                <label 
                  htmlFor="lastName" 
                  className="font-['Jost',sans-serif] font-medium text-[#374151] block mb-2"
                >
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  required
                  className="font-['Bitter',serif] w-full p-3 rounded-lg border-2 border-[#E2E8F0] focus:border-[#427d78] focus:outline-none transition-colors"
                  style={{ fontSize: '1rem' }}
                />
              </div>

              {/* Full Name Input */}
              <div>
                <label 
                  htmlFor="fullName" 
                  className="font-['Jost',sans-serif] font-medium text-[#374151] block mb-2"
                >
                  Full Birth Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., John Michael Smith"
                  required
                  className="font-['Bitter',serif] w-full p-3 rounded-lg border-2 border-[#E2E8F0] focus:border-[#427d78] focus:outline-none transition-colors"
                  style={{ fontSize: '1rem' }}
                />
                <p className="font-['Bitter',serif] text-sm text-gray-500 mt-1">
                  Your full name as it appears on your birth certificate
                </p>
              </div>

              {/* Birth Date Input */}
              <div>
                <label 
                  htmlFor="birthDate" 
                  className="font-['Jost',sans-serif] font-medium text-[#374151] block mb-2"
                >
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <input
                  id="birthDate"
                  type="text"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder="MM/DD/YYYY or M/D/YY"
                  required
                  className="font-['Bitter',serif] w-full p-3 rounded-lg border-2 border-[#E2E8F0] focus:border-[#427d78] focus:outline-none transition-colors"
                  style={{ fontSize: '1rem' }}
                />
                <p className="font-['Bitter',serif] text-sm text-gray-500 mt-1">
                  Example: 7/23/1985 or 07/23/85
                </p>
              </div>
            </div>

            {/* How It Works */}
            <div className="mt-6 p-4 bg-[#427d78]/5 rounded-lg border-l-4 border-[#427d78]">
              <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] mb-2">
                How It Works
              </h3>
              <p className="font-['Bitter',serif] text-sm text-[#666] leading-relaxed">
                Each letter of your name converts to a number (A=1, Z=26), then reduces to a single digit.
                Combined with your birth date digits, these numbers map to the five elements of the Dagara cosmology:
                <strong> Water (1,6)</strong>, <strong>Fire (2,7)</strong>, <strong>Nature (3,8)</strong>,
                <strong> Mineral (4,9)</strong>, and <strong>Earth (0,5)</strong>.
              </p>
            </div>
          </div>

          {/* Results Section */}
          {showResults && (
            <>
              {/* Medicine Wheel Visualization */}
              <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
                <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78] text-center" style={{ marginBottom: 'var(--space-4)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  Your Medicine Wheel
                </h2>
                <MedicineWheel data={wheelData} />
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="font-['Jost',sans-serif] text-sm font-medium text-blue-600 mb-1">
                      Dominant Element
                    </div>
                    <div className="font-['Jost',sans-serif] text-2xl font-bold" style={{ color: elementDescriptions[dominantElement.element]?.color }}>
                      {dominantElement.element}
                    </div>
                    <div className="font-['Bitter',serif] text-sm text-gray-600">
                      {dominantElement.count} occurrences
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="font-['Jost',sans-serif] text-sm font-medium text-blue-600 mb-1">
                      Masculine Energy
                    </div>
                    <div className="font-['Jost',sans-serif] text-2xl font-bold text-[#4682B4]">
                      {energyBalance.masculine}
                    </div>
                    <div className="font-['Bitter',serif] text-sm text-gray-600">
                      {totalDigits > 0 ? Math.round((energyBalance.masculine / totalDigits) * 100) : 0}% of total
                    </div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                    <div className="font-['Jost',sans-serif] text-sm font-medium text-purple-600 mb-1">
                      Feminine Energy
                    </div>
                    <div className="font-['Jost',sans-serif] text-2xl font-bold text-[#967BB6]">
                      {energyBalance.feminine}
                    </div>
                    <div className="font-['Bitter',serif] text-sm text-gray-600">
                      {totalDigits > 0 ? Math.round((energyBalance.feminine / totalDigits) * 100) : 0}% of total
                    </div>
                  </div>
                </div>
              </div>

              {/* Influence Table */}
              <div className="card" style={{ marginBottom: 'var(--space-5)' }}>
                <h2 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-4)', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
                  Elemental Influences
                </h2>
                <InfluenceTable digitCounts={digitCounts} />
              </div>

              {/* Spirit Bird & Interpretation */}
              {dominantElement.count > 0 && (
                <div className="card" style={{ background: `linear-gradient(135deg, ${elementDescriptions[dominantElement.element]?.color}15 0%, #ffffff 100%)`, border: `2px solid ${elementDescriptions[dominantElement.element]?.color}40` }}>
                  <div className="text-center mb-4">
                    <h2 className="font-['Jost',sans-serif] font-bold" style={{ color: elementDescriptions[dominantElement.element]?.color, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: 'var(--space-2)' }}>
                      Your Spirit Bird: {elementDescriptions[dominantElement.element]?.bird}
                    </h2>
                    <p className="font-['Jost',sans-serif] text-lg text-gray-600">
                      Primary Element: {dominantElement.element}
                    </p>
                  </div>
                  
                  <p className="font-['Bitter',serif] text-[#374151] leading-relaxed" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: '1.8' }}>
                    {elementDescriptions[dominantElement.element]?.description}
                  </p>

                  <div className="mt-6 p-4 bg-white/80 rounded-lg">
                    <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78] mb-3">
                      Your Elemental Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-['Bitter',serif] text-sm">
                      <div>
                        <strong className="text-[#4299E1]">Water ({wheelData.water}):</strong> Emotional healing & reconciliation
                      </div>
                      <div>
                        <strong className="text-[#48BB78]">Nature ({wheelData.nature}):</strong> Growth & transformation
                      </div>
                      <div>
                        <strong className="text-[#F56565]">Fire ({wheelData.fire}):</strong> Vision & ancestral wisdom
                      </div>
                      <div>
                        <strong className="text-[#A0AEC0]">Mineral ({wheelData.mineral}):</strong> Memory & structure
                      </div>
                      <div className="md:col-span-2 text-center">
                        <strong className="text-[#D69E2E]">Earth ({wheelData.earth}):</strong> Home & sanctuary
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="card text-center" style={{ background: 'linear-gradient(135deg, #427d78 0%, #967BB6 100%)', color: 'white', marginTop: 'var(--space-5)' }}>
                <h2 className="font-['Jost',sans-serif] font-bold" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'var(--space-3)' }}>
                  {submitSuccess ? 'Results Saved!' : 'Save Your Results'}
                </h2>
                <p className="font-['Bitter',serif]" style={{ fontSize: 'clamp(1rem, 2vw, 1.125rem)', marginBottom: 'var(--space-4)', opacity: 0.95 }}>
                  {submitSuccess 
                    ? "Your medicine wheel profile has been saved. We'll send you personalized insights and guidance based on your elemental blueprint."
                    : "Save your medicine wheel results and receive personalized guidance on working with your elemental energies through Soul Cultivation practices."
                  }
                </p>
                {!submitSuccess && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !email || !firstName || !lastName || !fullName || !birthDate}
                    className="inline-block bg-white text-[#427d78] font-['Jost',sans-serif] font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ padding: '1rem 2rem', fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save My Results →'}
                  </button>
                )}
                {submitSuccess && (
                  <a
                    href="mailto:scott@soulcultivationnow.com?subject=Medicine%20Wheel%20Consultation"
                    className="inline-block bg-white text-[#427d78] font-['Jost',sans-serif] font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                    style={{ padding: '1rem 2rem', fontSize: 'clamp(1rem, 2vw, 1.125rem)' }}
                  >
                    Schedule a Consultation →
                  </a>
                )}
              </div>
            </>
          )}

          {/* Empty State */}
          {!showResults && (
            <div className="card text-center" style={{ padding: 'var(--space-6)', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
              <div className="text-6xl mb-4">🌀</div>
              <h3 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', marginBottom: 'var(--space-2)' }}>
                Enter Your Information Above
              </h3>
              <p className="font-['Bitter',serif] text-[#666]" style={{ maxWidth: '500px', marginInline: 'auto' }}>
                Your medicine wheel will appear here as you type. Watch the elements come alive with your unique energetic signature.
              </p>
            </div>
          )}
        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
