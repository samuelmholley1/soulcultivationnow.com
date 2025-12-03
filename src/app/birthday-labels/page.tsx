'use client';

import { SiteNavigation } from '@/components/SiteNavigation';
import { SiteFooterContent } from '@/components/SiteFooterContent';
import { Button } from '@/components/Button';
import { useState } from 'react';

export default function BirthdayLabelsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-birthday-labels');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate labels');
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `birthday-labels-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading labels:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate labels');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <SiteNavigation />
      
      {/* Main Content */}
      <div className="bg-[#fafbff]" style={{ paddingBlock: 'var(--space-2)' }}>
        <div className="container">

          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h1 className="font-['Jost',sans-serif] font-bold text-[#427d78]" style={{ marginBottom: 'var(--space-1)', lineHeight: '1.1', fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>
              Birthday Mailing Labels
            </h1>
            <p className="font-['Bitter',serif] text-[#666]" style={{ marginBottom: 0, maxWidth: '700px', marginInline: 'auto', lineHeight: '1.4', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>
              Generate Avery 5160 mailing labels for birthday card recipients.
            </p>
          </div>

          {/* Download Card */}
          <div className="card" style={{ maxWidth: '600px', marginInline: 'auto', textAlign: 'center' }}>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg" style={{ padding: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <h3 className="text-sm md:text-base font-['Jost',sans-serif] font-semibold text-blue-900" style={{ marginBottom: 'var(--space-1)', lineHeight: '1.2' }}>
                  📬 Label Format: Avery 5160
                </h3>
                <p className="text-xs md:text-sm text-blue-800 font-['Bitter',serif]" style={{ marginBottom: 0, lineHeight: '1.4' }}>
                  30 labels per sheet (3 columns × 10 rows)<br />
                  Label size: 2.625&quot; × 1&quot;
                </p>
              </div>

              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? 'Generating Labels...' : 'Download PDF Labels'}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-400 rounded-lg">
                  <p className="text-sm text-red-800 font-['Bitter',serif]" style={{ marginBottom: 0 }}>
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4" style={{ marginTop: 'var(--space-2)' }}>
              <h3 className="font-['Jost',sans-serif] font-semibold text-[#427d78] text-sm mb-2">
                Instructions
              </h3>
              <ol className="text-left text-xs md:text-sm text-[#666] font-['Bitter',serif]" style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  Click the button above to download the PDF file
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Load Avery 5160 label sheets into your printer
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Print the PDF (ensure &quot;Actual Size&quot; is selected, not &quot;Fit to Page&quot;)
                </li>
                <li>
                  Verify alignment with first sheet before printing all labels
                </li>
              </ol>
            </div>
          </div>

        </div>
      </div>

      <SiteFooterContent />
    </>
  );
}
