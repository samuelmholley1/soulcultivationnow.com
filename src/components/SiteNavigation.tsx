'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ContactModal } from './ContactModal';

export function SiteNavigation() {
  return (
    <header className="bg-[#427d78] sticky top-0 z-50 shadow-md">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo - Soul Cultivation */}
          <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity flex items-center gap-3">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <Image 
                src="/logo.png" 
                alt="Soul Cultivation Logo" 
                width={64} 
                height={64}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="text-white">
              <div className="font-['Jost',sans-serif] font-bold text-lg md:text-xl leading-tight">Soul Cultivation</div>
              <div className="font-['Bitter',serif] text-xs md:text-sm opacity-90">Ancient Wisdom • Modern Psychology</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/quiz"
              className="text-white font-['Jost',sans-serif] font-medium text-sm hover:text-[#FFD700] transition-colors"
            >
              Take Quiz
            </Link>
            <Link
              href="/soul-cultivation"
              className="text-white font-['Jost',sans-serif] font-medium text-sm hover:text-[#FFD700] transition-colors"
            >
              The Bridge
            </Link>
            <div className="text-white font-['Jost',sans-serif] font-medium text-sm hover:text-[#FFD700] transition-colors">
              <ContactModal />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
