import Link from 'next/link';
import Image from 'next/image';

export function SiteFooterContent() {
  return (
    <footer className="bg-[#fafbff] border-t border-gray-200">
      <div className="container" style={{ paddingBlock: 'var(--space-5)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: 'var(--space-4)' }}>
          {/* About Soul Cultivation */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="Soul Cultivation" width={32} height={32} className="rounded-full" />
              <h2 className="text-sm font-['Jost',sans-serif] font-bold text-[#427d78]">Soul Cultivation</h2>
            </div>
            <p className="text-[#666] font-['Bitter',serif] text-xs leading-relaxed">
              <strong className="text-black">Scott Sherman</strong><br />
              The Mendocino Alchemist<br />
              Blue Heron Lineage • Dagara Cosmology<br />
              Master&apos;s Level Social Worker
            </p>
            <p className="text-[#666] font-['Bitter',serif] text-xs leading-relaxed mt-2">
              Redwood Valley, CA<br />
              <a href="mailto:contact@soulcultivationnow.com" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors break-words">contact@soulcultivationnow.com</a>
            </p>
          </div>

          {/* Philosophy */}
          <div>
            <h2 className="text-sm font-['Jost',sans-serif] font-bold text-[#427d78] mb-2">The Philosophy</h2>
            <p className="text-[#666] font-['Bitter',serif] text-xs leading-relaxed italic">
              &quot;We can&apos;t not become enlightened; it is our destiny path. We might as well embrace it.&quot;
            </p>
            <p className="text-[#666] font-['Bitter',serif] text-xs leading-relaxed mt-2">
              Moving from trauma to flow by aligning the Three Brains: Head, Heart, and Gut.
            </p>
          </div>

          {/* Pathways */}
          <div>
            <h2 className="text-sm font-['Jost',sans-serif] font-bold text-[#427d78] mb-2">Pathways</h2>
            <ul className="space-y-1 text-[#666] font-['Bitter',serif] text-xs">
              <li><Link href="/quiz" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors">Dagara Quiz</Link></li>
              <li><Link href="/professional" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors">Material Path</Link></li>
              <li><Link href="/soul-cultivation" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors">The Bridge (Recommended)</Link></li>
              <li><Link href="/shamanic" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors">Soul Path</Link></li>
              <li><Link href="/blog/twelve-elders" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors">12 Elders Blog</Link></li>
            </ul>
          </div>

          {/* Spirit Birds */}
          <div>
            <h2 className="text-sm font-['Jost',sans-serif] font-bold text-[#427d78] mb-2">The Five Elements</h2>
            <ul className="text-[#666] font-['Bitter',serif] text-xs leading-relaxed space-y-1">
              <li>🔥 Fire - The Flicker</li>
              <li>🕊️ Water - The Blue Heron</li>
              <li>🦢 Earth - The Egret</li>
              <li>🦅 Mineral - The Wind Eagle</li>
              <li>🐦 Nature - The Hummingbird</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)' }} className="border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1 text-xs text-[#666] font-['Bitter',serif]">
            <p>© 2025 Soul Cultivation • Scott Sherman</p>
            <p>Built by <a href="https://samuelholley.com" target="_blank" rel="noopener noreferrer" className="text-[#427d78] hover:text-[#5eb3a1] transition-colors font-semibold">Samuel Holley AI Consulting</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
